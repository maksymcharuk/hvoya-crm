import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { AuthModule } from '@modules/auth/auth.module';
import { OrdersModule } from '@modules/orders/orders.module';

import { OneCController } from './controllers/one-c.controller';
import { OneCApiService } from './services/one-c-api/one-c-api.service';

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
    OrdersModule,
    AuthModule,
  ],
  providers: [OneCApiService],
  controllers: [OneCController],
})
export class OneCApiModule {}
