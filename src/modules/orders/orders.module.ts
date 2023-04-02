import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { BalanceModule } from '../balance/balance.module';
import { CartModule } from '../cart/cart.module';
import { CaslModule } from '../casl/casl.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesModule } from '../files/files.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderEntity,
      OrderItemEntity,
      OrderDeliveryEntity,
      PaymentTransactionEntity,
    ]),
    CaslModule,
    CartModule,
    CloudinaryModule,
    FilesModule,
    BalanceModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
