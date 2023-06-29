import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';
import { MailModule } from '@modules/mail/mail.module';

import { CaslModule } from '../casl/casl.module';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

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
    OneCClientModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
