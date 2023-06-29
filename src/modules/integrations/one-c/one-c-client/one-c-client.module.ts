import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { OneCApiClientService } from './services/one-c-api-client/one-c-api-client.service';
import { OneCSyncService } from './services/one-c-sync/one-c-sync.service';
import { OneCTasksService } from './services/one-c-tasks/one-c-tasks.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      UserEntity,
      OrderEntity,
      OrderItemEntity,
      OrderStatusEntity,
      PaymentTransactionEntity,
    ]),
  ],
  providers: [OneCApiClientService, OneCSyncService, OneCTasksService],
  exports: [OneCApiClientService, OneCSyncService],
})
export class OneCClientModule {}
