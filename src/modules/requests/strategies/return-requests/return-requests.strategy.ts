import Decimal from 'decimal.js';
import { In, QueryRunner } from 'typeorm';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { BalanceEntity } from '@entities/balance.entity';
import { FileEntity } from '@entities/file.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { OrderReturnRequestItemEntity } from '@entities/order-return-request-item.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { DeliveryService } from '@enums/delivery-service.enum';
import { DeliveryStatus } from '@enums/delivery-status.enum';
import { Folder } from '@enums/folder.enum';
import { OrderReturnRequestStatus } from '@enums/order-return-request-status.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@enums/transaction-sync-one-c-status.enum';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { FilesService } from '@modules/files/services/files.service';
import { DeliveryServiceFactory } from '@modules/integrations/delivery/factories/delivery-service/delivery-service.factory';
import { OneCApiClientService } from '@modules/integrations/one-c/one-c-client/services/one-c-api-client/one-c-api-client.service';
import { RequestStrategy } from '@modules/requests/core/request-strategy.interface';
import { ApproveRequestStrategyDto } from '@modules/requests/interfaces/approve-request-strategy.dto';
import { CreateRequestStrategyDto } from '@modules/requests/interfaces/create-request-strategy.dto';
import { RejectRequestStrategyDto } from '@modules/requests/interfaces/reject-request-strategy.dto';
import { RestoreRequestStrategyDto } from '@modules/requests/interfaces/restore-request-strategy.dto';
import { UpdateRequestStrategyDto } from '@modules/requests/interfaces/update-request.strategy.dto';

@Injectable()
export class ReturnRequestsStrategy implements RequestStrategy {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly filesService: FilesService,
    private readonly oneCApiClientService: OneCApiClientService,
    private readonly deliveryServiceFactory: DeliveryServiceFactory,
  ) {}

  async createRequest(data: CreateRequestStrategyDto): Promise<RequestEntity> {
    let waybillFile!: FileEntity;
    try {
      const isRequestExists = await data.queryRunner.manager.findOne(
        OrderReturnRequestEntity,
        {
          where: {
            order: { number: data.createRequestDto.returnRequest.orderNumber },
          },
        },
      );

      if (isRequestExists) {
        throw new BadRequestException(
          'Замовлення з таким номером вже має запит на повернення',
        );
      }

      const noItemToReturn =
        data.createRequestDto.returnRequest.requestedItems.every(
          (item) => item.quantity === 0,
        );

      if (noItemToReturn) {
        throw new BadRequestException(
          'Не вказано жодного товару для повернення',
        );
      }

      if (data.document) {
        waybillFile = await this.filesService.uploadAutoFile(
          data.queryRunner,
          data.document,
          {
            folder: Folder.ReturnRequestFiles,
          },
        );
      }

      data.images = data.images || [];
      const customerImagesFiles = await Promise.all(
        data.images.map((image) =>
          this.filesService.uploadFile(data.queryRunner, image, {
            folder: Folder.ReturnRequestImages,
          }),
        ),
      );

      const deliveryStatus = await this.getRequestDeliveryStatus(
        data.createRequestDto.returnRequest.deliveryService,
        data.createRequestDto.returnRequest.trackingId,
      );

      const requestDelivery = await data.queryRunner.manager.save(
        OrderReturnDeliveryEntity,
        {
          status: deliveryStatus?.status,
          rawStatus: deliveryStatus?.rawStatus,
          trackingId: data.createRequestDto.returnRequest.trackingId,
          deliveryService: data.createRequestDto.returnRequest.deliveryService,
          waybill: waybillFile,
        },
      );

      const order = await data.queryRunner.manager.findOneOrFail(OrderEntity, {
        where: { number: data.createRequestDto.returnRequest.orderNumber },
        relations: ['items'],
      });

      const returnRequest = await data.queryRunner.manager.save(
        OrderReturnRequestEntity,
        {
          order: order,
          delivery: requestDelivery,
        },
      );

      await data.queryRunner.manager.save(
        OrderReturnRequestItemEntity,
        data.createRequestDto.returnRequest.requestedItems.map((item) => ({
          orderItem: { id: item.orderItemId },
          quantity: item.quantity,
          orderReturnRequested: { id: returnRequest.id },
        })),
      );

      const returnItems = await data.queryRunner.manager.find(
        OrderReturnRequestItemEntity,
        {
          where: {
            orderReturnRequested: { id: returnRequest.id },
          },
          relations: ['orderItem'],
        },
      );
      const returnItemsTotal = this.calculateTotal(returnItems);

      const resultRequest = await data.queryRunner.manager.save(
        OrderReturnRequestEntity,
        {
          id: returnRequest.id,
          total: returnItemsTotal,
          requestedItems: returnItems,
        },
      );

      return data.queryRunner.manager.save(RequestEntity, {
        customer: { id: data.userId },
        customerComment: data.createRequestDto.customerComment,
        requestType: data.createRequestDto.requestType,
        returnRequest: { id: resultRequest.id },
        customerImages: customerImagesFiles,
      });
    } catch (error) {
      if (waybillFile) {
        await this.filesService.deleteFilesCloudinary([waybillFile]);
      }
      throw new BadRequestException(error.message);
    }
  }

  async approveRequest(
    data: ApproveRequestStrategyDto,
  ): Promise<RequestEntity> {
    let request: RequestEntity;
    const user = await data.queryRunner.manager.findOneOrFail(UserEntity, {
      where: { id: data.userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    request = await data.queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest.approvedItems.orderItem',
        'returnRequest.delivery',
        'returnRequest.order',
        'customer',
      ],
      where: { number: data.requestNumber },
    });

    if (
      ability.cannot(Action.Approve, request) ||
      ability.cannot(Action.Approve, request.returnRequest!)
    ) {
      throw new ForbiddenException(
        'У вас немає прав для оновлення цього запиту або запит вже був закритий',
      );
    }

    const noItemToReturn =
      data.approveRequestDto.returnRequest.approvedItems.every(
        (item) => item.quantity === 0,
      );

    if (noItemToReturn) {
      throw new BadRequestException('Не вказано жодного товару для повернення');
    }

    const approvedOrderItems = await data.queryRunner.manager.find(
      OrderItemEntity,
      {
        where: {
          id: In(
            data.approveRequestDto.returnRequest.approvedItems.map(
              (item) => item.orderItemId,
            ),
          ),
        },
      },
    );
    const approvedItems =
      await data.queryRunner.manager.create<OrderReturnRequestItemEntity>(
        OrderReturnRequestItemEntity,
        approvedOrderItems.map((item) => ({
          orderItem: item,
          quantity: data.approveRequestDto.returnRequest.approvedItems.find(
            (i) => i.orderItemId === item.id,
          )!.quantity,
        })),
      );

    const approvedItemsTotal = this.calculateTotal(approvedItems);

    const isDecutionGreatedThanTotal = new Decimal(
      data.approveRequestDto.returnRequest.deduction,
    ).greaterThan(approvedItemsTotal);

    if (isDecutionGreatedThanTotal) {
      throw new BadRequestException(
        'Сума відрахування не може бути більшою ніж загальна сума товарів для повернення',
      );
    }

    data.images = data.images || [];
    const managerImagesFiles = await Promise.all(
      data.images.map((image) =>
        this.filesService.uploadFile(data.queryRunner, image, {
          folder: Folder.ReturnRequestImages,
        }),
      ),
    );

    await data.queryRunner.manager.save(RequestEntity, {
      id: request.id,
      managerComment: data.approveRequestDto.managerComment,
      managerImages: managerImagesFiles,
    });

    await data.queryRunner.manager.save(OrderReturnRequestEntity, {
      id: request.returnRequest!.id,
      status: OrderReturnRequestStatus.Approved,
      deduction: data.approveRequestDto.returnRequest.deduction,
    });

    await data.queryRunner.manager.save(OrderReturnDeliveryEntity, {
      id: request.returnRequest!.delivery.id,
      status: DeliveryStatus.Received,
    });

    await data.queryRunner.manager.save(
      OrderReturnRequestItemEntity,
      data.approveRequestDto.returnRequest.approvedItems.map((item) => ({
        quantity: item.quantity,
        orderItem: { id: item.orderItemId },
        orderReturnApproved: { id: request.returnRequest!.id },
      })),
    );

    await data.queryRunner.manager.save(OrderReturnRequestEntity, {
      id: request!.returnRequest!.id,
      total: approvedItemsTotal,
    });

    await this.updateBalanceOnReturn(
      data.queryRunner,
      request.customer.id,
      request.id,
    );

    await this.updateProductsStockOnReturn(data.queryRunner, request.id);

    await data.queryRunner.manager.save(OrderEntity, {
      id: request.returnRequest!.order.id,
      currentStatus: OrderStatus.Refunded,
    });

    await data.queryRunner.manager.save(OrderStatusEntity, {
      status: OrderStatus.Refunded,
      comment: 'Замовлення поністю або частково повернено клієнтом',
      order: { id: request.returnRequest!.order.id },
    });

    const perItemDeduction = new Decimal(
      data.approveRequestDto.returnRequest.deduction,
    ).div(approvedItems.length);

    await this.oneCApiClientService.return({
      userId: request.customer.id,
      orderId: request.returnRequest!.order.id,
      items: approvedItems.map((item) => ({
        sku: item.orderItem.product.sku,
        quantity: item.quantity,
        price: item.orderItem.productProperties.price.minus(perItemDeduction),
      })),
      createdAt: new Date(),
    });

    return request;
  }

  async rejectRequest(data: RejectRequestStrategyDto): Promise<RequestEntity> {
    let request: RequestEntity;
    const user = await data.queryRunner.manager.findOneOrFail(UserEntity, {
      where: { id: data.userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    request = await data.queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest.approvedItems.orderItem',
        'returnRequest.delivery',
        'customer',
      ],
      where: { number: data.requestNumber },
    });

    if (
      ability.cannot(Action.Decline, request) ||
      ability.cannot(Action.Decline, request.returnRequest!)
    ) {
      throw new ForbiddenException(
        'У вас немає прав для оновлення цього запиту або запит вже був закритий',
      );
    }

    data.images = data.images || [];
    const managerImagesFiles = await Promise.all(
      data.images.map((image) =>
        this.filesService.uploadFile(data.queryRunner, image, {
          folder: Folder.ReturnRequestImages,
        }),
      ),
    );

    await data.queryRunner.manager.save(RequestEntity, {
      id: request.id,
      managerComment: data.rejectRequestDto.managerComment,
      managerImages: managerImagesFiles,
    });

    await data.queryRunner.manager.save(OrderReturnRequestEntity, {
      id: request.returnRequest!.id,
      status: OrderReturnRequestStatus.Declined,
    });

    const delivery = await data.queryRunner.manager.findOneOrFail(
      OrderReturnDeliveryEntity,
      {
        where: { id: request.returnRequest!.delivery.id },
      },
    );

    if (delivery.status !== DeliveryStatus.Received) {
      await data.queryRunner.manager.save(OrderReturnDeliveryEntity, {
        id: request.returnRequest!.delivery.id,
        status: DeliveryStatus.Declined,
      });
    }

    return request;
  }

  async updateRequest(data: UpdateRequestStrategyDto): Promise<RequestEntity> {
    let waybillScan: FileEntity | undefined;
    const { queryRunner, userId, requestNumber, document, updateRequestDto } =
      data;

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
          'У вас немає прав для оновлення цього запиту або запит вже був закритий',
        );
      }

      if (document) {
        waybillScan = await this.filesService.uploadAutoFile(
          queryRunner,
          document,
          {
            folder: Folder.OrderFiles,
          },
        );
      }

      const { deliveryService, trackingId } = updateRequestDto.returnRequest;
      let deliveryStatus;

      if (deliveryService && trackingId) {
        deliveryStatus = await this.getRequestDeliveryStatus(
          deliveryService,
          trackingId,
        );
      }

      await queryRunner.manager.update(
        OrderReturnDeliveryEntity,
        request.returnRequest!.delivery.id,
        {
          status: deliveryStatus?.status,
          rawStatus: deliveryStatus?.rawStatus,
          deliveryService,
          trackingId,
          waybill: waybillScan,
        },
      );

      return request;
    } catch (error) {
      if (waybillScan) {
        await this.filesService.deleteFilesCloudinary([waybillScan]);
      }
      throw new BadRequestException(error.message);
    }
  }

  async restoreRequest(
    data: RestoreRequestStrategyDto,
  ): Promise<RequestEntity> {
    let request: RequestEntity;
    const user = await data.queryRunner.manager.findOneOrFail(UserEntity, {
      where: { id: data.userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    request = await data.queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: ['returnRequest', 'customer'],
      where: { number: data.requestNumber },
    });

    if (
      ability.cannot(Action.Restore, request) ||
      ability.cannot(Action.Restore, request.returnRequest!)
    ) {
      throw new ForbiddenException(
        'У вас немає прав для оновлення цього запиту або запит вже був закритий',
      );
    }

    if (request.returnRequest!.status === OrderReturnRequestStatus.Approved) {
      throw new BadRequestException(
        'Неможливо відновити запит на повернення товару який вже було схвалено',
      );
    }

    await data.queryRunner.manager.save(OrderReturnRequestEntity, {
      id: request.returnRequest!.id,
      status: OrderReturnRequestStatus.Pending,
    });

    return request;
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

    const total = this.calculateTotal(
      request.returnRequest!.approvedItems,
    ).minus(request.returnRequest!.deduction);

    const balance = await queryRunner.manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    const paymentTransactions = await queryRunner.manager.find(
      PaymentTransactionEntity,
      {
        where: { balance: { id: balance.id } },
        order: {
          createdAt: 'DESC',
        },
      },
    );

    const orderReturnRequest = await queryRunner.manager.findOneOrFail(
      OrderReturnRequestEntity,
      {
        where: { id: request.returnRequest!.id },
      },
    );

    await queryRunner.manager.save(OrderReturnRequestEntity, {
      id: orderReturnRequest.id,
      total,
    });

    const transaction = await queryRunner.manager.save(
      PaymentTransactionEntity,
      {
        amount: total,
        netBalance: balance.amount.plus(total),
        status: TransactionStatus.Success,
        syncOneCStatus: TransactionSyncOneCStatus.Success,
        balance,
        orderReturnRequest,
      },
    );

    await queryRunner.manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(total),
      paymentTransactions: [...paymentTransactions, transaction],
    });
  }

  private async updateProductsStockOnReturn(
    queryRunner: QueryRunner,
    requestId: string,
  ) {
    const request = await queryRunner.manager.findOneOrFail(RequestEntity, {
      relations: ['customer', 'returnRequest.approvedItems.orderItem'],
      where: { id: requestId },
    });

    const approvedItemsIds = request.returnRequest!.approvedItems.map(
      (item) => item.orderItem.product.id,
    );

    const productsToUpdate = await queryRunner.manager.find(
      ProductVariantEntity,
      {
        where: { id: In(approvedItemsIds) },
      },
    );

    productsToUpdate.forEach((product) => {
      const approvedItem = request.returnRequest!.approvedItems.find(
        (item) => item.orderItem.product.id === product.id,
      );

      if (approvedItem) {
        product.stock += approvedItem.quantity;
      }
    });

    await queryRunner.manager.save(ProductVariantEntity, productsToUpdate);
  }

  private async getRequestDeliveryStatus(
    deliveryServiceName: DeliveryService,
    trackingId: string,
  ): Promise<DeliveryServiceRawStatus | undefined> {
    if (deliveryServiceName === DeliveryService.SelfPickup) {
      return;
    }

    const deliveryService =
      this.deliveryServiceFactory.getDeliveryService(deliveryServiceName);

    if (!deliveryService) {
      throw new BadRequestException('Вказано невірну службу доставки');
    }

    const deliveryStatus = (
      await deliveryService.getDeliveryStatuses({
        trackingInfo: [{ trackingId: trackingId }],
      })
    ).statuses[0];

    if (deliveryServiceName !== DeliveryService.UkrPoshta && !deliveryStatus) {
      throw new BadRequestException('Вказаний номер ТТН не є дійсним');
    }

    return deliveryStatus;
  }
}
