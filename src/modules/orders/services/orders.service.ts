import Decimal from 'decimal.js';
import { FilesService } from 'src/modules/files/services/files.service';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  In,
  QueryRunner,
} from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  COMPLETED_ORDER_STATUSES,
  ORDER_STATUSES_TO_DELIERY_STATUSES,
} from '@constants/order.constants';
import { CreateOrderDto } from '@dtos/create-order.dto';
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
import { Folder } from '@enums/folder.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';
import { SyncProduct } from '@interfaces/one-c';
import { validateOrderStatus } from '@utils/orders/validate-orer-status.util';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { BalanceService } from '@modules/balance/services/balance.service';
import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
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

  async getOrders(userId: string): Promise<OrderEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    let orders = await this.getOrdersWhere();

    return orders
      .filter((order) => ability.can(Action.Read, order))
      .map((order) => sanitizeEntity(ability, order));
  }

  async getOrdersForReturnRequest(userId: string): Promise<OrderEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    let statuses = await manager.find(OrderStatusEntity, {
      where: { status: OrderStatus.Fulfilled },
      relations: ['order'],
    });

    let orders = await this.dataSource.manager.find(OrderEntity, {
      where: statuses.map((status) => ({ id: status.order.id })),
      relations: [
        'items',
        'items.product.properties',
        'items.productProperties.images',
        'customer',
      ],
    });

    return orders
      .filter((order) => ability.can(Action.Read, order))
      .map((order) => sanitizeEntity(ability, order));
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;

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

      if (waybill) {
        waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
          folder: Folder.OrderFiles,
        });
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
        await queryRunner.manager.update(
          OrderDeliveryEntity,
          order.delivery.id,
          {
            trackingId: updateOrderDto.trackingId,
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

        await this.upsertOrderToOneC(userId, order, updateOrderDto.orderStatus);
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

      if (updateOrderByCustomerDto.trackingId) {
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
          OrderDeliveryEntity,
          order.delivery.id,
          {
            trackingId: updateOrderByCustomerDto.trackingId,
            waybill: waybillScan,
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
    if (!COMPLETED_ORDER_STATUSES.includes(status)) {
      return;
    }

    await queryRunner.manager.update(OrderDeliveryEntity, order.delivery.id, {
      status:
        ORDER_STATUSES_TO_DELIERY_STATUSES.get(status) ||
        OrderDeliveryStatus.Unspecified,
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
    const transaction = await manager.save(PaymentTransactionEntity, {
      amount: order.total,
      status: TransactionStatus.Success,
      balance,
      order,
    });
    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(order.total),
      paymentTransactions: [...balance.paymentTransactions, transaction],
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

    validateOrderStatus(order.statuses[0]!.status, status);

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

    if (
      newStatus.status === OrderStatus.Cancelled ||
      newStatus.status === OrderStatus.Refunded
    ) {
      await this.updateBalanceAndStockOnCancel(queryRunner.manager, order);
      await this.oneCApiClientService.cancel(order.id);
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
      status: newStatus,
      items: order.items.map((item) => ({
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.productProperties.price,
      })),
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
      ],
      order: {
        statuses: {
          createdAt: 'DESC',
        },
      },
    });
  }

  private getOrdersWhere(
    params?: FindOptionsWhere<OrderEntity>,
  ): Promise<OrderEntity[]> {
    return this.dataSource.manager.find(OrderEntity, {
      where: params,
      relations: [
        'items.productProperties',
        'delivery',
        'statuses',
        'customer',
      ],
      order: {
        createdAt: 'DESC',
        statuses: {
          createdAt: 'DESC',
        },
      },
    });
  }
}
