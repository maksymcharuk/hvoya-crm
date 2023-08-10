import Decimal from 'decimal.js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { CreateRequestDto } from '@dtos/create-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';

import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { FileEntity } from '@entities/file.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { BalanceEntity } from '@entities/balance.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';

import { RequestType } from '@enums/request-type.enum';
import { Action } from '@enums/action.enum';
import { Folder } from '@enums/folder.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';

import { ReturnRequestService } from '@modules/requests/return-requests/services/return-request/return-request.service';
import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { FilesService } from '@modules/files/services/files.service';

import { sanitizeEntity } from '@utils/serialize-entity.util';

@Injectable()
export class RequestService {

  constructor(
    private dataSource: DataSource,
    private returnRequestService: ReturnRequestService,
    private caslAbilityFactory: CaslAbilityFactory,
    private filesService: FilesService,
  ) { }

  async createRequest(userId: string, createRequestDto: CreateRequestDto, waybill?: Express.Multer.File): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;
    let someRequest: OrderReturnRequestEntity | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      switch (createRequestDto.requestType) {
        case RequestType.Return:
          if (waybill) {
            waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
              folder: Folder.ReturnRequestFiles,
            });
            someRequest = await this.returnRequestService.createRequest(queryRunner, createRequestDto, waybillScan);
          }
          break;

        default:
          throw new HttpException(
            'Невідомий тип замовлення',
            HttpStatus.BAD_REQUEST,
          );
      }

      if (!someRequest) {
        throw new HttpException(
          'Не вдалося створити замовлення',
          HttpStatus.BAD_REQUEST,
        );
      }

      const request = await queryRunner.manager.save(RequestEntity, {
        customer: { id: userId },
        customerComment: createRequestDto.customerComment,
        requestType: createRequestDto.requestType,
        requestId: someRequest.id,
      })

      await queryRunner.commitTransaction();
      return this.getRequest(userId, request.number!);
    } catch (err) {
      try {
        if (waybillScan) {
          await this.filesService.deleteFilesCloudinary([waybillScan]);
        }
      } finally {
        await queryRunner.rollbackTransaction();
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getRequest(userId: string, number: string): Promise<RequestEntity> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const request = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest',
        'customer',
        'returnRequest.delivery',
        'returnRequest.requestedItems',
        'returnRequest.requestedItems.orderItem',
        'returnRequest.requestedItems.orderItem.productProperties.images',
        'returnRequest.requestedItems.orderItem.product.baseProduct',
        'returnRequest.order',
      ],
      where: { number: number },
    })

    if (ability.cannot(Action.Read, request)) {
      throw new HttpException(
        'У вас немає прав для перегляду цього замовлення',
        HttpStatus.FORBIDDEN,
      );
    }

    return sanitizeEntity(ability, request);
  }

  async getRequests(userId: string): Promise<RequestEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const requests = await this.dataSource.manager.find(RequestEntity, {
      relations: ['returnRequest', 'customer', 'returnRequest.delivery'],
    });

    return requests
      .filter(request => ability.can(Action.Read, request))
      .map((request) => sanitizeEntity(ability, request));
  }


  async updateRequestByCustomer(
    userId: string,
    requestNumber: string,
    updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    waybill?: Express.Multer.File,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;
    let request: RequestEntity;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: userId },
      });

      const ability = this.caslAbilityFactory.createForUser(user);

      request = await queryRunner.manager.findOneOrFail(RequestEntity, {
        relations: ['returnRequest', 'customer', 'returnRequest.delivery'],
        where: { number: requestNumber },
      });

      if (ability.cannot(Action.Update, request)) {
        throw new HttpException(
          'У вас немає прав для оновлення цього замовлення',
          HttpStatus.FORBIDDEN,
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

      await queryRunner.commitTransaction();
      return this.getRequest(userId, requestNumber);
    } catch (err) {
      try {
        if (waybillScan) {
          await this.filesService.deleteFilesCloudinary([waybillScan]);
        }
      } finally {
        await queryRunner.rollbackTransaction();
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async approveRequest(
    userId: string,
    requestNumber: string,
    approveRequestDto: ApproveReturnRequestDto,
  ): Promise<RequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let request: RequestEntity;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: userId },
      });

      const ability = this.caslAbilityFactory.createForUser(user);

      request = await queryRunner.manager.findOneOrFail(RequestEntity, {
        relations: ['returnRequest', 'customer', 'returnRequest.delivery'],
        where: { number: requestNumber },
      });

      if (ability.cannot(Action.Update, request)) {
        throw new HttpException(
          'У вас немає прав для оновлення цього замовлення',
          HttpStatus.FORBIDDEN,
        );
      }

      await queryRunner.manager.save(
        OrderReturnRequestEntity,
        {
          id: request.returnRequest!.id,
          approved: true,
          approvedItems: approveRequestDto.approvedItems,
        }
      );

      await this.updateBalanceOnReturn(queryRunner.manager, userId, request.id);

      return this.getRequest(userId, request.number!);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateBalanceOnReturn(
    manager: EntityManager,
    userId: string,
    requestId: string,
  ) {

    const request = await manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest',
        'customer',
        'returnRequest.approvedItems',
        'returnRequest.approvedItems.orderItem',
      ],
      where: { id: requestId },
    });

    if (!request.returnRequest!.approvedItems[0]) {
      throw new HttpException(
        'Не вказано жодного товару для повернення',
        HttpStatus.FORBIDDEN,
      );
    }

    const total = request.returnRequest!.approvedItems.reduce((acc: Decimal, item) => {
      return acc.add(new Decimal(item.orderItem.productProperties.price).mul(item.quantity))
    }, new Decimal(0)).minus(request.returnRequest!.deduction);


    const balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    const orderReturnRequest = await manager.findOneOrFail(OrderReturnRequestEntity, {
      where: { order: { id: request.returnRequest?.id } },
    });

    const transaction = await manager.save(PaymentTransactionEntity, {
      amount: total,
      status: TransactionStatus.Success,
      balance,
      orderReturnRequest,
    });

    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(total),
      paymentTransactions: [...balance.paymentTransactions, transaction],
    });
  }
}
