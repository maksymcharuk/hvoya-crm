import Decimal from 'decimal.js';
import { QueryRunner } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { RejectReturnRequestDto } from '@dtos/reject-return-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { BalanceEntity } from '@entities/balance.entity';
import { FileEntity } from '@entities/file.entity';
import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { OrderReturnRequestItemEntity } from '@entities/order-return-request-item.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { DeliveryStatus } from '@enums/delivery-status.enum';
import { Folder } from '@enums/folder.enum';
import { OrderReturnRequestStatus } from '@enums/order-return-request-status.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { FilesService } from '@modules/files/services/files.service';
import { RequestStrategy } from '@modules/requests/core/request-strategy.interface';

@Injectable()
export class ReturnRequestsStrategy implements RequestStrategy {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly filesService: FilesService,
  ) {}

  async createRequest(
    queryRunner: QueryRunner,
    userId: string,
    createRequestDto: CreateRequestDto,
    waybillScan?: Express.Multer.File,
  ): Promise<RequestEntity> {
    let waybillFile!: FileEntity;
    try {
      const isRequestExists = await queryRunner.manager.findOne(
        OrderReturnRequestEntity,
        {
          where: {
            order: { number: createRequestDto.returnRequest.orderNumber },
          },
        },
      );

      if (isRequestExists) {
        throw new BadRequestException(
          'Замовлення з таким номером вже має заявку на повернення',
        );
      }

      if (!waybillScan) {
        throw new BadRequestException('Waybill scan is required');
      }

      waybillFile = await this.filesService.uploadFile(
        queryRunner,
        waybillScan,
        {
          folder: Folder.ReturnRequestFiles,
        },
      );

      const requestDelivery = await queryRunner.manager.save(
        OrderReturnDeliveryEntity,
        {
          trackingId: createRequestDto.returnRequest.trackingId,
          deliveryService: createRequestDto.returnRequest.deliveryService,
          waybill: waybillFile,
        },
      );

      const order = await queryRunner.manager.findOneOrFail(OrderEntity, {
        where: { number: createRequestDto.returnRequest.orderNumber },
        relations: ['items'],
      });

      const returnRequest = await queryRunner.manager.save(
        OrderReturnRequestEntity,
        {
          deduction: createRequestDto.returnRequest.deduction,
          order: order,
          delivery: requestDelivery,
        },
      );

      await queryRunner.manager.save(
        OrderReturnRequestItemEntity,
        createRequestDto.returnRequest.requestedItems.map((item) => ({
          orderItem: { id: item.orderItemId },
          quantity: item.quantity,
          orderReturnRequested: { id: returnRequest.id },
        })),
      );

      const returnItems = await queryRunner.manager.find(
        OrderReturnRequestItemEntity,
        {
          where: {
            orderReturnRequested: { id: returnRequest.id },
          },
          relations: ['orderItem'],
        },
      );
      const returnItemsTotal = this.calculateTotal(returnItems);

      const resultRequest = await queryRunner.manager.save(
        OrderReturnRequestEntity,
        {
          id: returnRequest.id,
          total: returnItemsTotal,
          requestedItems: returnItems,
        },
      );

      return queryRunner.manager.save(RequestEntity, {
        customer: { id: userId },
        customerComment: createRequestDto.customerComment,
        requestType: createRequestDto.requestType,
        requestId: resultRequest.id,
      });
    } catch (error) {
      if (waybillFile) {
        await this.filesService.deleteFilesCloudinary([waybillFile]);
      }
      throw new BadRequestException(error.message);
    }
  }

  async approveRequest(
    queryRunner: QueryRunner,
    userId: string,
    requestNumber: string,
    approveRequestDto: ApproveReturnRequestDto,
  ): Promise<RequestEntity> {
    let request: RequestEntity;
    const user = await queryRunner.manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    request = await queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest.approvedItems.orderItem',
        'returnRequest.delivery',
        'customer',
      ],
      where: { number: requestNumber },
    });

    if (
      ability.cannot(Action.Approve, request) ||
      ability.cannot(Action.Approve, request.returnRequest!)
    ) {
      throw new ForbiddenException(
        'У вас немає прав для оновлення цієї заявки або заявка вже була закрита',
      );
    }

    const noItemToReturn = approveRequestDto.approvedItems.every(
      (item) => item.quantity === 0,
    );

    if (noItemToReturn) {
      throw new BadRequestException('Не вказано жодного товару для повернення');
    }

    let returnRequest = await queryRunner.manager.save(
      OrderReturnRequestEntity,
      {
        id: request.returnRequest!.id,
        status: OrderReturnRequestStatus.Approved,
      },
    );

    await queryRunner.manager.save(OrderReturnDeliveryEntity, {
      id: request.returnRequest!.delivery.id,
      status: DeliveryStatus.Received,
    });

    await queryRunner.manager.save(
      OrderReturnRequestItemEntity,
      approveRequestDto.approvedItems.map((item) => ({
        quantity: item.quantity,
        orderItem: { id: item.orderItemId },
        orderReturnApproved: { id: returnRequest.id },
      })),
    );

    const approvedItems = await queryRunner.manager.find(
      OrderReturnRequestItemEntity,
      {
        where: {
          orderReturnApproved: { id: returnRequest.id },
        },
        relations: ['orderItem'],
      },
    );
    const approvedItemsTotal = this.calculateTotal(approvedItems);
    returnRequest = await queryRunner.manager.save(OrderReturnRequestEntity, {
      id: returnRequest.id,
      total: approvedItemsTotal,
    });

    await this.updateBalanceOnReturn(
      queryRunner,
      request.customer.id,
      request.id,
    );

    return request;
  }

  async rejectRequest(
    queryRunner: QueryRunner,
    userId: string,
    requestNumber: string,
    rejectRequestDto: RejectReturnRequestDto,
  ): Promise<RequestEntity> {
    let request: RequestEntity;
    const user = await queryRunner.manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    request = await queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest.approvedItems.orderItem',
        'returnRequest.delivery',
        'customer',
      ],
      where: { number: requestNumber },
    });

    if (
      ability.cannot(Action.Decline, request) ||
      ability.cannot(Action.Decline, request.returnRequest!)
    ) {
      throw new ForbiddenException(
        'У вас немає прав для оновлення цієї заявки або заявка вже була закрита',
      );
    }

    await queryRunner.manager.save(RequestEntity, {
      id: request.id,
      managerComment: rejectRequestDto.managerComment,
    });

    await queryRunner.manager.save(OrderReturnRequestEntity, {
      id: request.returnRequest!.id,
      status: OrderReturnRequestStatus.Declined,
    });

    await queryRunner.manager.save(OrderReturnDeliveryEntity, {
      id: request.returnRequest!.delivery.id,
      status: DeliveryStatus.Declined,
    });

    return request;
  }

  async updateRequestByCustomer(
    queryRunner: QueryRunner,
    userId: string,
    requestNumber: string,
    updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    waybill?: Express.Multer.File,
  ): Promise<RequestEntity> {
    let waybillScan: FileEntity | undefined;

    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: userId },
      });

      const ability = this.caslAbilityFactory.createForUser(user);

      const request = await queryRunner.manager.findOneOrFail(RequestEntity, {
        relations: ['returnRequest', 'customer', 'returnRequest.delivery'],
        where: { number: requestNumber },
      });

      if (
        ability.cannot(Action.Update, request) ||
        ability.cannot(Action.Update, request.returnRequest!)
      ) {
        throw new ForbiddenException(
          'У вас немає прав для оновлення цієї заявки або заявка вже закрита',
        );
      }

      if (updateRequestByCustomerDto.trackingId) {
        if (waybill) {
          waybillScan = await this.filesService.uploadFile(
            queryRunner,
            waybill,
            {
              folder: Folder.OrderFiles,
            },
          );
        }
        await queryRunner.manager.update(
          OrderReturnDeliveryEntity,
          request.returnRequest!.delivery.id,
          {
            trackingId: updateRequestByCustomerDto.trackingId,
            waybill: waybillScan,
          },
        );
      }

      return request;
    } catch (error) {
      if (waybillScan) {
        await this.filesService.deleteFilesCloudinary([waybillScan]);
      }
      throw new BadRequestException(error.message);
    }
  }

  private calculateTotal(orderItems: OrderReturnRequestItemEntity[]): Decimal {
    return orderItems.reduce(
      (total, item: OrderReturnRequestItemEntity) =>
        total.add(item.orderItem.productProperties.price.times(item.quantity)),
      new Decimal(0),
    );
  }

  private async updateBalanceOnReturn(
    queryRunner: QueryRunner,
    userId: string,
    requestId: string,
  ) {
    const request = await queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: ['customer', 'returnRequest.approvedItems.orderItem'],
      where: { id: requestId },
    });

    const total = request
      .returnRequest!.approvedItems.reduce((acc: Decimal, item) => {
        return acc.add(
          new Decimal(item.orderItem.productProperties.price).mul(
            item.quantity,
          ),
        );
      }, new Decimal(0))
      .minus(request.returnRequest!.deduction);

    const balance = await queryRunner.manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    const orderReturnRequest = await queryRunner.manager.findOneOrFail(
      OrderReturnRequestEntity,
      {
        where: { id: request.returnRequest!.id },
      },
    );

    const transaction = await queryRunner.manager.save(
      PaymentTransactionEntity,
      {
        amount: total,
        status: TransactionStatus.Success,
        balance,
        orderReturnRequest,
      },
    );

    await queryRunner.manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(total),
      paymentTransactions: [...balance.paymentTransactions, transaction],
    });
  }
}
