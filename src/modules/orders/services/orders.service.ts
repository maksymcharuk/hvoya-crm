import Decimal from 'decimal.js';
import { FilesService } from 'src/modules/files/services/files.service';
import { DataSource, In, QueryRunner } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateOrderDto } from '@dtos/create-order.dto';
import { UpdateOrderWaybillDto } from '@dtos/update-order-waybill.dto';
import { UpdateOrderDto } from '@dtos/update-order.dto';
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
import { OrderStatus } from '@enums/order-status.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';
import { SyncProduct } from '@interfaces/one-c';

import { BalanceService } from '../../../modules/balance/services/balance.service';
import { CaslAbilityFactory } from '../../../modules/casl/casl-ability/casl-ability.factory';
import { OneCApiService } from '../../../modules/integrations/one-c/services/one-c-api/one-c-api.service';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
    private cartService: CartService,
    private balanceService: BalanceService,
    private oneCApiService: OneCApiService,
    private caslAbilityFactory: CaslAbilityFactory,
    private eventEmitter: EventEmitter2,
  ) {}

  async getOrder(userId: string, orderNumber: string): Promise<OrderEntity> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const order = await this.getOrderWhere({ number: orderNumber }, [
      'customer',
    ]);

    if (ability.cannot(Action.Read, order)) {
      throw new HttpException(
        'У вас немає прав для перегляду цього замовлення',
        HttpStatus.FORBIDDEN,
      );
    }

    return order;
  }

  async getOrders(userId: string): Promise<OrderEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.can(Action.SuperRead, OrderEntity)) {
      return this.getOrdersWhere();
    } else {
      return this.getOrdersWhere({ customer: { id: userId } });
    }
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
          'Не вдалось опрацювати замолення. Спробуйте очистити кошик і вибрати товари знову.',
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
            'Не вдалось опрацювати замолення. Спробуйте очистити кошик і вибрати товари знову.',
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
        paymentTransaction: transaction,
        total: orderTotal,
        statuses: [status],
      });

      await this.cartService.clearCart(userId, queryRunner.manager);

      await this.upsertOrderToOneC(userId, order, status.status);

      this.eventEmitter.emit(NotificationEvent.OrderCreated, {
        message: `Нове замовлення №${order.number}`,
        data: order,
        type: NotificationType.Order,
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
        if (err.response.data) {
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
      const order = await this.getOrderWhere({ number: orderNumber }, [
        'customer',
      ]);

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
      return this.getOrderWhere({ id: order.id }, ['customer']);
    } catch (err) {
      try {
        if (waybillScan) {
          await this.filesService.deleteFilesCloudinary([waybillScan]);
        }
      } finally {
        await queryRunner.rollbackTransaction();
        if (err.response.data) {
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

  async updateOrderWaybill(
    userId: string,
    orderNumber: string,
    updateOrderWaybillDto: UpdateOrderWaybillDto,
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

      order = await this.getOrderWhere({ number: orderNumber }, ['customer']);

      if (ability.cannot(Action.Update, order)) {
        throw new HttpException(
          'У вас немає прав для оновлення цього замовлення',
          HttpStatus.FORBIDDEN,
        );
      }

      if (waybill) {
        waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
          folder: Folder.OrderFiles,
        });
      }
      await queryRunner.manager.update(OrderDeliveryEntity, order.delivery.id, {
        trackingId: updateOrderWaybillDto.trackingId,
        waybill: waybillScan,
      });

      await queryRunner.commitTransaction();
      return this.getOrderWhere({ id: order.id });
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
    const order = await this.getOrderWhere({ id: orderId }, ['customer']);

    if (status === order.statuses[0]!.status) {
      throw new HttpException(
        'Статус замовлення не може бути змінений на попередній.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newStatus = await queryRunner.manager.save(OrderStatusEntity, {
      status: status,
      comment: comment,
      order: { id: order.id },
      createdBy: { id: userId },
    });

    await queryRunner.manager.save(OrderEntity, {
      id: order.id,
      statuses: [...order.statuses, newStatus],
    });

    this.eventEmitter.emit(NotificationEvent.OrderUpdated, {
      message: `Статус замовлення змінено.`,
      data: order,
      userId: order.customer.id,
      type: NotificationType.Order,
    });
  }

  private async upsertOrderToOneC(
    userId: string,
    order: OrderEntity,
    newStatus?: OrderStatus,
  ) {
    return this.oneCApiService.order({
      userId: userId,
      id: order.id,
      total: this.calculateTotal(order.items),
      status: newStatus,
      items: order.items.map((item) => ({
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.productProperties.price,
      })),
      createdAt: order.createdAt, // '2023-05-29T14:06:07'
    });
  }

  private async syncProductsStock(products: SyncProduct[]) {
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
    params: any,
    relations: string[] = [],
  ): Promise<OrderEntity> {
    return this.dataSource.manager.findOneOrFail(OrderEntity, {
      where: params,
      relations: [
        'items.product',
        'items.product.baseProduct',
        'items.productProperties',
        'delivery.waybill',
        'paymentTransactions',
        'statuses',
        ...relations,
      ],
      order: {
        statuses: {
          createdAt: 'DESC',
        },
      },
    });
  }

  private getOrdersWhere(params?: any): Promise<OrderEntity[]> {
    return this.dataSource.manager.find(OrderEntity, {
      where: params,
      relations: [
        'items.product',
        'items.product.baseProduct',
        'items.productProperties',
        'delivery.waybill',
        'paymentTransactions',
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
