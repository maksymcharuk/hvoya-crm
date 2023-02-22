import Decimal from 'decimal.js';
import { FilesService } from 'src/modules/files/services/files.service';
import { DataSource } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateOrderDto } from '@dtos/create-order.dto';
import { UpdateOrderWaybillDto } from '@dtos/update-order-waybill.dto';
import { UpdateOrderDto } from '@dtos/update-order.dto';
import { FileEntity } from '@entities/file.entity';
import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Folder } from '@enums/folder.enum';

import { CaslAbilityFactory } from '../../../modules/casl/casl-ability/casl-ability.factory';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
    private cartService: CartService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getOrder(userId: number, orderId: number): Promise<OrderEntity> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const order = await this.getOrderWhere({ id: orderId }, ['customer']);

    if (ability.cannot(Action.Read, order)) {
      throw new HttpException(
        'You are not allowed to read this order',
        HttpStatus.FORBIDDEN,
      );
    }

    return order;
  }

  async getOrders(userId: number): Promise<OrderEntity[]> {
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
    userId: number,
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
        throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
      }

      if (waybill) {
        waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
          folder: Folder.OrderFiles,
        });
      }

      let order = await queryRunner.manager.save(OrderEntity, {
        customer: { id: userId },
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

      const orderDelivery = await queryRunner.manager.save(
        OrderDeliveryEntity,
        {
          trackingId: createOrderDto.trackingId,
          firstName: createOrderDto.firstName,
          lastName: createOrderDto.lastName,
          middleName: createOrderDto.middleName,
          phoneNumber: createOrderDto.phoneNumber,
          email: createOrderDto.email,
          deliveryType: createOrderDto.deliveryType,
          city: createOrderDto.city,
          postOffice: createOrderDto.postOffice,
          waybill: waybillScan,
        },
      );

      const paymentTransaction = await queryRunner.manager.save(
        PaymentTransactionEntity,
        {
          amount: this.calculateTotal(orderItems),
          order: { id: order.id },
        },
      );

      order = await queryRunner.manager.save(OrderEntity, {
        id: order.id,
        items: orderItems,
        delivery: orderDelivery,
        paymentTransaction,
        total: this.calculateTotal(orderItems),
      });

      await this.cartService.clearCart(userId);

      await queryRunner.commitTransaction();
      return this.getOrder(userId, order.id);
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

  async updateOrder(
    orderId: number,
    updateOrderDto?: UpdateOrderDto,
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let order = await this.getOrderWhere({ id: orderId });

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
            firstName: updateOrderDto.firstName,
            lastName: updateOrderDto.lastName,
            middleName: updateOrderDto.middleName,
            phoneNumber: updateOrderDto.phoneNumber,
            email: updateOrderDto.email,
            deliveryType: updateOrderDto.deliveryType,
            status: updateOrderDto.deliveryStatus,
            city: updateOrderDto.city,
            postOffice: updateOrderDto.postOffice,
          },
        );

        await queryRunner.manager.update(OrderEntity, orderId, {
          status: updateOrderDto.orderStatus,
        });
      }

      await queryRunner.commitTransaction();
      return this.getOrderWhere({ id: orderId });
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

  async updateOrderWaybill(
    userId: number,
    orderId: number,
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

      order = await this.getOrderWhere({ id: orderId }, ['customer']);

      if (ability.cannot(Action.Update, order)) {
        throw new HttpException(
          'You are not allowed to update this order',
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
      return this.getOrderWhere({ id: orderId });
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

  private getOrderWhere(
    params: any,
    relations: string[] = [],
  ): Promise<OrderEntity> {
    return this.dataSource.manager.findOneOrFail(OrderEntity, {
      where: params,
      relations: [
        'items.product',
        'items.productProperties',
        'delivery.waybill',
        'paymentTransactions',
        ...relations,
      ],
    });
  }

  private getOrdersWhere(params?: any): Promise<OrderEntity[]> {
    return this.dataSource.manager.find(OrderEntity, {
      where: params,
      relations: [
        'items.product',
        'items.productProperties',
        'delivery.waybill',
        'paymentTransactions',
        'customer',
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
