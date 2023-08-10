import Decimal from 'decimal.js';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { Injectable } from '@nestjs/common';

import { CreateRequestDto } from '@dtos/create-request.dto';

import { FileEntity } from '@entities/file.entity';
import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { OrderReturnRequestItemEntity } from '@entities/order-return-request-item.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderEntity } from '@entities/order.entity';

@Injectable()
export class ReturnRequestService {
  constructor() { }

  async createRequest(
    queryRunner: QueryRunner,
    createRequestDto: CreateRequestDto,
    waybillScan?: FileEntity,
  ): Promise<OrderReturnRequestEntity> {
    const requestDelivery = await queryRunner.manager.save(
      OrderReturnDeliveryEntity,
      {
        trackingId: createRequestDto.returnRequest.trackingId,
        deliveryService: createRequestDto.returnRequest.deliveryService,
        waybill: waybillScan,
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

    return queryRunner.manager.save(OrderReturnRequestEntity, {
      id: returnRequest.id,
      total: returnItemsTotal,
      requestedItems: returnItems,
    });
  }

  private calculateTotal(orderItems: OrderReturnRequestItemEntity[]): Decimal {
    console.log(orderItems);
    return orderItems.reduce(
      (total, item: OrderReturnRequestItemEntity) =>
        total.add(item.orderItem.productProperties.price.times(item.quantity)),
      new Decimal(0),
    );
  }
}
