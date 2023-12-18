import Decimal from 'decimal.js';
import { FilesService } from 'src/modules/files/services/files.service';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  In,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  ORDER_STATUSES_TO_DELIERY_STATUSES,
  RETURNABLE_ORDER_STATUSES,
} from '@constants/order.constants';
import { CreateOrderDto } from '@dtos/create-order.dto';
import { OrdersPageOptionsDto } from '@dtos/orders-page-options.dto';
import { UpdateOrderByCustomerDto } from '@dtos/update-order-by-customer.dto';
import { UpdateOrderDto } from '@dtos/update-order.dto';
import { BalanceEntity } from '@entities/balance.entity';
import { FileEntity } from '@entities/file.entity';
import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { DeliveryService } from '@enums/delivery-service.enum';
import { DeliveryStatus } from '@enums/delivery-status.enum';
import { Folder } from '@enums/folder.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { SortOrder } from '@enums/sort-order.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@enums/transaction-sync-one-c-status.enum';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';
import { SyncProduct } from '@interfaces/one-c';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';
import { validateOrderStatusForAdmin } from '@utils/orders/validate-orer-status.util';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { BalanceService } from '@modules/balance/services/balance.service';
import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { DeliveryServiceFactory } from '@modules/integrations/delivery/factories/delivery-service/delivery-service.factory';
import { OneCApiClientService } from '@modules/integrations/one-c/one-c-client/services/one-c-api-client/one-c-api-client.service';

import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
    private cartService: CartService,
    private balanceService: BalanceService,
    private oneCApiClientService: OneCApiClientService,
    private caslAbilityFactory: CaslAbilityFactory,
    private eventEmitter: EventEmitter2,
    private deliveryServiceFactory: DeliveryServiceFactory,
  ) {}

  async getOrder(userId: string, orderNumber: string): Promise<OrderEntity> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const order = await this.getOrderWhere({ number: orderNumber });

    if (ability.cannot(Action.Read, order)) {
      throw new HttpException(
        'У вас немає прав для перегляду цього замовлення',
        HttpStatus.FORBIDDEN,
      );
    }

    return sanitizeEntity(ability, order);
  }

  async getOrders(
    currentUserId: string,
    pageOptionsDto: OrdersPageOptionsDto,
    userId?: string,
  ): Promise<Page<OrderEntity>> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: currentUserId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const queryBuilder = this.getOrderQuery();

    if (userId) {
      queryBuilder.andWhere('order.customer = :userId', { userId });
    } else {
      queryBuilder.andWhere('order.customer = :currentUserId', {
        currentUserId,
      });
    }

    if (pageOptionsDto.createdAt) {
      const startDate = new Date(pageOptionsDto.createdAt);
      const endDate = new Date(pageOptionsDto.createdAt);
      endDate.setHours(23, 59, 59, 999);
      queryBuilder
        .andWhere('order.createdAt >= :startDate', { startDate })
        .andWhere('order.createdAt <= :endDate', { endDate });
    }

    if (pageOptionsDto.status) {
      queryBuilder.andWhere('statuses.status = :status', {
        status: pageOptionsDto.status,
      });
    }

    if (pageOptionsDto.deliveryStatus) {
      queryBuilder.andWhere('delivery.status = :deliveryStatus', {
        deliveryStatus: pageOptionsDto.deliveryStatus,
      });
    }

    if (pageOptionsDto.deliveryService) {
      queryBuilder.andWhere('delivery.deliveryService = :deliveryService', {
        deliveryService: pageOptionsDto.deliveryService,
      });
    }

    if (pageOptionsDto.customerIds) {
      queryBuilder.andWhere('order.customer IN (:...customersIds)', {
        customersIds: pageOptionsDto.customerIds,
      });
    }

    if (pageOptionsDto.searchQuery) {
      queryBuilder.andWhere(
        '(LOWER(order.number) LIKE LOWER(:searchQuery) OR LOWER(delivery.trackingId) LIKE LOWER(:searchQuery))',
        {
          searchQuery: `%${pageOptionsDto.searchQuery}%`,
        },
      );
    }

    if (pageOptionsDto.orderBy) {
      queryBuilder.addOrderBy(
        `order.${pageOptionsDto.orderBy}`,
        pageOptionsDto.order,
      );
    } else {
      queryBuilder.addOrderBy(`order.createdAt`, SortOrder.DESC);
    }

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    let { entities } = await queryBuilder.getRawAndEntities();

    const orders: OrderEntity[] = entities.map((order) =>
      sanitizeEntity(ability, order),
    );

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(orders, pageMetaDto);
  }

  async getOrderNumberListForReturnRequest(userId: string): Promise<string[]> {
    const query = this.dataSource.createQueryBuilder(OrderEntity, 'order');

    const statusesSubQuery = query
      .subQuery()
      .select('id')
      .from(OrderStatusEntity, 'orderStatus')
      .where('orderStatus.order = order.id')
      .orderBy('orderStatus.createdAt', SortOrder.DESC)
      .limit(1);

    query
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect(
        'order.statuses',
        'statuses',
        `statuses.id = ${statusesSubQuery.getQuery()}`,
      )
      .leftJoinAndSelect('order.returnRequest', 'returnRequest')
      .where('customer.id = :userId', { userId })
      .andWhere('statuses.status IN (:...returnableOrderStatuses)', {
        returnableOrderStatuses: RETURNABLE_ORDER_STATUSES,
      })
      .andWhere('returnRequest.id IS NULL')
      .select(['order.number'])
      .orderBy('order.createdAt', SortOrder.DESC);

    const orders = await query.getMany();

    return orders.map((order) => order.number!);
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;
    let deliveryStatus: DeliveryServiceRawStatus | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cart = await this.cartService.getCart(userId);

      if (cart.items.length === 0) {
        throw new HttpException('Кошик пустий', HttpStatus.BAD_REQUEST, {});
      }

      const outOfStockProducts = cart.items.filter(
        (item) => item.product.stock < item.quantity,
      );
      if (outOfStockProducts.length > 0) {
        throw new HttpException(
          {
            message: 'На жаль, деяких товарів вже немає в наявності',
            cart,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (createOrderDto.trackingId) {
        deliveryStatus = await this.validateDeliveryStatus(
          createOrderDto.deliveryService,
          createOrderDto.trackingId,
        );
      }

      if (waybill) {
        waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
          folder: Folder.OrderFiles,
        });
      } else if (
        createOrderDto.deliveryService !== DeliveryService.SelfPickup
      ) {
        throw new BadRequestException('Необхідно завантажити файл маркування');
      }

      let order = await queryRunner.manager.save(OrderEntity, {
        customer: { id: userId },
        customerNote: createOrderDto.customerNote,
      });

      const status = await queryRunner.manager.save(OrderStatusEntity, {
        order: { id: order.id },
      });

      const orderItems = await queryRunner.manager.save(
        OrderItemEntity,
        cart.items.map((item) => ({
          product: item.product,
          productProperties: item.product.properties,
          quantity: item.quantity,
          price: item.product.properties.price,
          order: { id: order.id },
        })),
      );
      const orderTotal = this.calculateTotal(orderItems);

      const orderDelivery = await queryRunner.manager.save(
        OrderDeliveryEntity,
        {
          trackingId: createOrderDto.trackingId,
          deliveryService: createOrderDto.deliveryService,
          // NOTE: Keep this for a waybill generation logic in future
          // firstName: createOrderDto.firstName,
          // lastName: createOrderDto.lastName,
          // middleName: createOrderDto.middleName,
          // phoneNumber: createOrderDto.phoneNumber,
          // email: createOrderDto.email,
          // deliveryType: createOrderDto.deliveryType,
          // city: createOrderDto.city,
          // postOffice: createOrderDto.postOffice,
          status: deliveryStatus?.status,
          rawStatus: deliveryStatus?.rawStatus,
          waybill: waybillScan,
        },
      );

      await this.balanceService.update(
        userId,
        orderTotal.neg(),
        queryRunner.manager,
        order.id,
      );

      const transaction = await queryRunner.manager.findOneOrFail(
        PaymentTransactionEntity,
        {
          where: { order: { id: order.id } },
        },
      );

      if (!transaction) {
        throw new HttpException(
          'Не вдалось опрацювати замовлення. Спробуйте очистити кошик і вибрати товари знову.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await queryRunner.manager.update(
        PaymentTransactionEntity,
        transaction.id,
        {
          status: TransactionStatus.Success,
          syncOneCStatus: TransactionSyncOneCStatus.Success,
        },
      );

      const variants = await queryRunner.manager.find(ProductVariantEntity, {
        where: {
          id: In(orderItems.map((item) => item.product.id)),
        },
      });
      variants.forEach((variant) => {
        const orderItemQuantity = orderItems.find(
          (item) => item.product.id === variant.id,
        )?.quantity;
        if (orderItemQuantity === undefined) {
          throw new HttpException(
            'Не вдалось опрацювати замовлення. Спробуйте очистити кошик і вибрати товари знову.',
            HttpStatus.BAD_REQUEST,
          );
        }
        variant.stock -= orderItemQuantity;
      });
      await queryRunner.manager.save(ProductVariantEntity, variants);

      // Fetch order again to get order with populated fields
      order = await queryRunner.manager.findOneOrFail(OrderEntity, {
        where: { id: order.id },
        relations: ['statuses', 'customer', 'items', 'items.product'],
      });

      await queryRunner.manager.save(OrderEntity, {
        id: order.id,
        items: orderItems,
        delivery: orderDelivery,
        total: orderTotal,
      });

      await this.cartService.clearCart(userId, queryRunner.manager);

      await this.upsertOrderToOneC(userId, order, status.status);

      this.eventEmitter.emit(NotificationEvent.OrderCreated, {
        data: order,
        type: NotificationType.OrderCreated,
      });

      await queryRunner.commitTransaction();
      return this.getOrder(userId, order.number!);
    } catch (err) {
      try {
        if (waybillScan) {
          await this.filesService.deleteFilesCloudinary([waybillScan]);
        }
      } finally {
        await queryRunner.rollbackTransaction();
        if (err.response && err.response.data) {
          await this.syncProductsStock(err.response.data);
        }
        throw new HttpException(
          {
            message: err.message,
            cart: await this.cartService.getCart(userId),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrder(
    orderNumber: string,
    userId: string,
    updateOrderDto?: UpdateOrderDto,
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;
    let deliveryStatus: DeliveryServiceRawStatus | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.getOrderWhere({ number: orderNumber });

      if (waybill) {
        waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
          folder: Folder.OrderFiles,
        });
        await queryRunner.manager.update(
          OrderDeliveryEntity,
          order.delivery.id,
          {
            waybill: waybillScan,
          },
        );
      }

      if (updateOrderDto) {
        if (updateOrderDto.trackingId && updateOrderDto.deliveryService) {
          deliveryStatus = await this.getOrderDeliveryStatus(
            updateOrderDto.deliveryService,
            updateOrderDto.trackingId,
          );
        }

        await queryRunner.manager.update(
          OrderDeliveryEntity,
          order.delivery.id,
          {
            trackingId: updateOrderDto.trackingId,
            deliveryService: updateOrderDto.deliveryService,
            status: deliveryStatus?.status,
            rawStatus: deliveryStatus?.rawStatus,
            // NOTE: Keep this for a waybill generation logic in future
            // firstName: updateOrderDto.firstName,
            // lastName: updateOrderDto.lastName,
            // middleName: updateOrderDto.middleName,
            // phoneNumber: updateOrderDto.phoneNumber,
            // email: updateOrderDto.email,
            // deliveryType: updateOrderDto.deliveryType,
            // city: updateOrderDto.city,
            // postOffice: updateOrderDto.postOffice,
          },
        );

        if (updateOrderDto.managerNote) {
          await queryRunner.manager.update(OrderEntity, order.id, {
            managerNote: updateOrderDto.managerNote,
          });
        }

        if (updateOrderDto.orderStatus) {
          await this.updateOrderStatus(
            queryRunner,
            order.id,
            userId,
            updateOrderDto.orderStatus,
            updateOrderDto.orderStatusComment,
          );
        }

        await this.upsertOrderToOneC(
          order.customer.id,
          order,
          updateOrderDto.orderStatus,
        );
      }

      await queryRunner.commitTransaction();
      return this.getOrder(userId, orderNumber);
    } catch (err) {
      try {
        if (waybillScan) {
          await this.filesService.deleteFilesCloudinary([waybillScan]);
        }
      } finally {
        await queryRunner.rollbackTransaction();
        if (err.response && err.response.data) {
          await this.syncProductsStock(err.response.data);
        }
        throw new HttpException(
          {
            message: err.message,
            cart: await this.cartService.getCart(userId),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderByCustomer(
    userId: string,
    orderNumber: string,
    updateOrderByCustomerDto: UpdateOrderByCustomerDto,
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;
    let order: OrderEntity;
    let deliveryStatus: DeliveryServiceRawStatus | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: userId },
      });

      const ability = this.caslAbilityFactory.createForUser(user);

      order = await this.getOrderWhere({ number: orderNumber });

      if (ability.cannot(Action.Update, order)) {
        throw new HttpException(
          'У вас немає прав для оновлення цього замовлення',
          HttpStatus.FORBIDDEN,
        );
      }

      if (
        updateOrderByCustomerDto.trackingId &&
        updateOrderByCustomerDto.deliveryService
      ) {
        deliveryStatus = await this.validateDeliveryStatus(
          updateOrderByCustomerDto.deliveryService,
          updateOrderByCustomerDto.trackingId,
        );

        if (waybill) {
          waybillScan = await this.filesService.uploadFile(
            queryRunner,
            waybill,
            {
              folder: Folder.OrderFiles,
            },
          );
        } else if (
          updateOrderByCustomerDto.deliveryService !==
          DeliveryService.SelfPickup
        ) {
          throw new BadRequestException(
            'Необхідно завантажити файл маркування',
          );
        }

        await queryRunner.manager.update(
          OrderDeliveryEntity,
          order.delivery.id,
          {
            trackingId: updateOrderByCustomerDto.trackingId,
            deliveryService: updateOrderByCustomerDto.deliveryService,
            waybill: waybillScan,
            status: deliveryStatus?.status,
            rawStatus: deliveryStatus?.rawStatus,
          },
        );
      }

      if (updateOrderByCustomerDto.customerNote) {
        await queryRunner.manager.update(OrderEntity, order.id, {
          customerNote: updateOrderByCustomerDto.customerNote,
        });
      }

      await queryRunner.commitTransaction();
      return this.getOrder(userId, orderNumber);
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

  async updateOrderDeliveryStatus(
    queryRunner: QueryRunner,
    order: OrderEntity,
    status: OrderStatus,
  ) {
    const deliveryStatus = ORDER_STATUSES_TO_DELIERY_STATUSES.get(status);

    if (!deliveryStatus) {
      return;
    }

    await queryRunner.manager.update(OrderDeliveryEntity, order.delivery.id, {
      status: deliveryStatus,
    });
  }

  async updateBalanceAndStockOnCancel(
    manager: EntityManager,
    order: OrderEntity,
  ) {
    // Update balance
    const balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: order.customer.id } },
    });
    const paymentTransactions = await manager.find(PaymentTransactionEntity, {
      where: { balance: { id: balance.id } },
      order: {
        createdAt: 'DESC',
      },
    });
    const transaction = await manager.save(PaymentTransactionEntity, {
      amount: order.total,
      netBalance: balance.amount.plus(order.total),
      status: TransactionStatus.Success,
      syncOneCStatus: TransactionSyncOneCStatus.Success,
      balance,
      order,
    });
    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(order.total),
      paymentTransactions: [...paymentTransactions, transaction],
    });

    // Update products stock
    const orderItems = await manager.find(OrderItemEntity, {
      where: { order: { id: order.id } },
      relations: ['product'],
    });
    const products = orderItems.map((orderItem) => {
      const product = orderItem.product;
      product.stock = product.stock + orderItem.quantity;
      return product;
    });
    await manager.save(ProductVariantEntity, products);
  }

  private calculateTotal(orderItems: OrderItemEntity[]): Decimal {
    return orderItems.reduce(
      (total, item) =>
        total.add(item.productProperties.price.times(item.quantity)),
      new Decimal(0),
    );
  }

  private async updateOrderStatus(
    queryRunner: QueryRunner,
    orderId: string,
    userId: string,
    status: OrderStatus,
    comment?: string,
  ): Promise<void> {
    const order = await this.getOrderWhere({ id: orderId });

    if (status === order.statuses[0]!.status) {
      throw new HttpException(
        'Статус замовлення не може бути змінений на попередній.',
        HttpStatus.BAD_REQUEST,
      );
    }

    validateOrderStatusForAdmin(order.statuses[0]!.status, status);

    const newStatus = await this.updateOrderStatusInternal(
      queryRunner,
      order,
      userId,
      status,
      comment,
    );

    this.eventEmitter.emit(NotificationEvent.OrderUpdated, {
      data: this.dataSource.manager.create(OrderEntity, {
        ...order,
        statuses: [newStatus, ...order.statuses],
      }),
      userId: order.customer.id,
      type: NotificationType.OrderStatusUpdated,
    });
  }

  async cancelByCustomer(
    userId: string,
    orderNumber: string,
  ): Promise<OrderEntity> {
    const user = await this.dataSource.manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });
    const order = await this.getOrderWhere({ number: orderNumber });

    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Cancel, order)) {
      throw new HttpException(
        'Неможливо скасувати дане замовлення',
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newStatus = await this.updateOrderStatusInternal(
        queryRunner,
        order,
        userId,
        OrderStatus.Cancelled,
        'Скасовано клієнтом',
      );

      this.eventEmitter.emit(NotificationEvent.OrderCancelled, {
        data: this.dataSource.manager.create(OrderEntity, {
          ...order,
          statuses: [newStatus, ...order.statuses],
        }),
        userId: order.customer.id,
        type: NotificationType.OrderCancelled,
      });

      await queryRunner.commitTransaction();
      return this.getOrder(userId, orderNumber);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  private async updateOrderStatusInternal(
    queryRunner: QueryRunner,
    order: OrderEntity,
    userId: string,
    status: OrderStatus,
    comment?: string,
  ): Promise<OrderStatusEntity> {
    const newStatus = await queryRunner.manager.save(OrderStatusEntity, {
      status: status,
      comment: comment,
      order: { id: order.id },
      createdBy: { id: userId },
    });

    await this.updateOrderDeliveryStatus(queryRunner, order, status);

    if (newStatus.status === OrderStatus.Cancelled) {
      await this.updateBalanceAndStockOnCancel(queryRunner.manager, order);

      if (order.statuses[0]!.status === OrderStatus.Processing) {
        // NOTE: If order was in processing status, then we need to return products to 1C
        try {
          await this.oneCApiClientService.return({
            userId: order.customer.id,
            orderId: order.id,
            items: order.items.map((item) => ({
              sku: item.product.sku,
              quantity: item.quantity,
              price: item.productProperties.price,
            })),
            createdAt: new Date(),
          });
        } catch (error) {
          // NOTE: If 1C return failed, then we try to cancel order in 1C
          await this.oneCApiClientService.cancel(order.id);
        }
      } else {
        // NOTE: If order was not in processing status, then we try to cancel order in 1C
        await this.oneCApiClientService.cancel(order.id);
      }
    }

    return newStatus;
  }

  private async upsertOrderToOneC(
    userId: string,
    order: OrderEntity,
    newStatus?: OrderStatus,
  ) {
    return this.oneCApiClientService.order({
      userId: userId,
      id: order.id,
      total: this.calculateTotal(order.items),
      number: order.number!,
      status: newStatus,
      items: order.items.map((item) => ({
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.productProperties.price,
      })),
      description: order.customerNote,
      createdAt: order.createdAt,
    });
  }

  private async syncProductsStock(products: SyncProduct[]): Promise<void> {
    if (!Array.isArray(products)) {
      return;
    }

    const productsToUpdate = await this.dataSource.manager.find(
      ProductVariantEntity,
      {
        where: products.map((product) => ({ sku: product.sku })),
      },
    );
    await this.dataSource.manager.save(
      ProductVariantEntity,
      productsToUpdate.map((product) => ({
        ...product,
        stock: products.find((p) => p.sku === product.sku)!.stock,
      })),
    );
  }

  private async getOrderDeliveryStatus(
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

  private async validateDeliveryStatus(
    deliveryServiceName: DeliveryService,
    trackingId: string,
  ): Promise<DeliveryServiceRawStatus | undefined> {
    const deliveryStatus = await this.getOrderDeliveryStatus(
      deliveryServiceName,
      trackingId,
    );

    if (deliveryStatus && deliveryStatus.status === DeliveryStatus.Received) {
      throw new BadRequestException(
        'Відправлення по вказаному номеру ТТН вже отримано',
      );
    }

    return deliveryStatus;
  }

  private getOrderWhere(
    params: FindOptionsWhere<OrderEntity>,
  ): Promise<OrderEntity> {
    return this.dataSource.manager.findOneOrFail(OrderEntity, {
      where: params,
      relations: [
        'items.product',
        'items.product.baseProduct',
        'items.productProperties',
        'delivery.waybill',
        'statuses',
        'customer',
        'returnRequest.request',
      ],
      order: {
        statuses: {
          createdAt: SortOrder.DESC,
        },
      },
    });
  }

  private getOrderQuery(number?: string): SelectQueryBuilder<OrderEntity> {
    const query = this.dataSource.createQueryBuilder(OrderEntity, 'order');

    if (number) {
      query.where('order.number = :number', { number });
    }

    const statusesSubQuery = query
      .subQuery()
      .select('id')
      .from(OrderStatusEntity, 'orderStatus')
      .where('orderStatus.order = order.id')
      .orderBy('orderStatus.createdAt', SortOrder.DESC)
      .limit(1);

    query
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.productProperties', 'productProperties')
      .leftJoinAndSelect('productProperties.images', 'images')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect(
        'order.statuses',
        'statuses',
        `statuses.id = ${statusesSubQuery.getQuery()}`,
      );

    return query;
  }
}
