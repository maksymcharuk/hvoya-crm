import { DataSource } from 'typeorm';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { validateOrderStatus } from '@utils/orders/validate-orer-status.util';

import { OrdersService } from '@modules/orders/services/orders.service';

import { UpdateOrderOneCDTO } from '../../../../../../interfaces/one-c/dtos/update-order.dto';

@Injectable()
export class OneCApiService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly ordersService: OrdersService,
  ) {}

  async updateOrder(
    orderId: string,
    updateOrderData: UpdateOrderOneCDTO,
  ): Promise<void> {
    const order = await this.dataSource.manager.findOne(OrderEntity, {
      where: { id: orderId },
      relations: ['items', 'statuses', 'customer'],
      order: {
        statuses: {
          createdAt: 'DESC',
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Замовлення не знайдено');
    }

    const orderStatus = order.statuses[0]!;

    if (orderStatus.status === updateOrderData.status) {
      return;
    }

    validateOrderStatus(orderStatus.status, updateOrderData.status);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newStatus = await queryRunner.manager.save(OrderStatusEntity, {
        status: updateOrderData.status,
        comment: 'Оновлено автоматично з 1С',
        order: { id: order.id },
      });

      await queryRunner.manager.save(OrderEntity, {
        id: order.id,
        statuses: [...order.statuses, newStatus],
      });

      if (updateOrderData.status === OrderStatus.Cancelled) {
        await this.ordersService.updateBalanceAndStockOnCancel(
          queryRunner.manager,
          order,
        );
      }

      this.eventEmitter.emit(NotificationEvent.OrderUpdated, {
        data: { ...order, statuses: [newStatus, ...order.statuses] },
        userId: order.customer.id,
        type: NotificationType.OrderStatusUpdated,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
