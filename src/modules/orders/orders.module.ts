import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { BalanceModule } from '@modules/balance/balance.module';
import { CartModule } from '@modules/cart/cart.module';
import { CaslModule } from '@modules/casl/casl.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { FilesModule } from '@modules/files/files.module';
import { DeliveryModule } from '@modules/integrations/delivery/delivery.module';
import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';

import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderEntity,
      OrderItemEntity,
      OrderDeliveryEntity,
      OrderStatusEntity,
      PaymentTransactionEntity,
    ]),
    CaslModule,
    CartModule,
    CloudinaryModule,
    FilesModule,
    BalanceModule,
    OneCClientModule,
    DeliveryModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
