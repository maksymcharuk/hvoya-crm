import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import Decimal from 'decimal.js';

import { FilesService } from '@modules/files/services/files.service';
import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';

import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { FileEntity } from '@entities/file.entity';
import { OrderReturnRequestItemEntity } from '@entities/order-return-request-item.entity';
import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { UserEntity } from '@entities/user.entity';
import { CreateReturnRequestDto } from '@dtos/create-return-request.dto';
import { Folder } from '@enums/folder.enum';
import { Action } from '@enums/action.enum';

@Injectable()
export class ReturnRequestService {

  constructor(
    private dataSource: DataSource,
    private filesService: FilesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) { }

  async createReturnRequest(
    userId: string,
    createReturnRequestDto: CreateReturnRequestDto,
    waybill?: Express.Multer.File,
  ): Promise<OrderReturnRequestEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    let waybillScan: FileEntity | undefined;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      if (waybill) {
        waybillScan = await this.filesService.uploadFile(queryRunner, waybill, {
          folder: Folder.ReturnRequestFiles,
        });
      }

      let request = await queryRunner.manager.save(OrderReturnRequestEntity, {
        customer: { id: userId },
        customerComment: createReturnRequestDto.customerComment,
      });

      const requestItems = await queryRunner.manager.save(
        OrderReturnRequestItemEntity,
        createReturnRequestDto.requestedItems.map((item) => ({
          orderItem: { id: item.orderItem.id },
          orderReturnRequested: { id: request.id },
          quantity: item.quantity,
        })),
      );
      const itemsTotal = this.calculateTotal(requestItems);

      const requestDelivery = await queryRunner.manager.save(
        OrderReturnDeliveryEntity,
        {
          trackingId: createReturnRequestDto.trackingId,
          deliveryService: createReturnRequestDto.deliveryService,
          waybill: waybillScan,
        },
      );

      await queryRunner.manager.save(OrderReturnRequestEntity, {
        id: request.id,
        items: requestItems,
        delivery: requestDelivery,
        total: itemsTotal,
      });

      await queryRunner.commitTransaction();
      return this.getReturnRequest(request.id, userId);
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

  async getReturnRequests(userId: string): Promise<OrderReturnRequestEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Read, OrderReturnRequestEntity)) {
      throw new HttpException(
        'У вас немає прав для перегляду цих запитів',
        HttpStatus.FORBIDDEN,
      );
    }

    let requests = await manager.find(OrderReturnRequestEntity, {
      where: { customer: { id: userId } },
      relations: ['requestedItems', 'requestedItems.orderItem', 'approvedItems', 'approvedItems.orderItem', 'order', 'customer'],
      order: {
        createdAt: 'DESC',
      },
    });

    return requests
      .filter((request) => ability.can(Action.Read, request));
  }

  async getReturnRequest(requestId: string, userId: string): Promise<OrderReturnRequestEntity> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });
    const request = await manager.findOneOrFail(OrderReturnRequestEntity, {
      where: { id: requestId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Read, request)) {
      throw new HttpException(
        'У вас немає прав для перегляду цього запитів',
        HttpStatus.FORBIDDEN,
      );
    }

    return request;
  }

  private calculateTotal(returnItems: OrderReturnRequestItemEntity[]): Decimal {
    return returnItems.reduce(
      (total, item) =>
        total.add(item.orderItem.productProperties.price.times(item.quantity)),
      new Decimal(0),
    );
  }
}
