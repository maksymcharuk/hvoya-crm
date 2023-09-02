import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';

import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';
import { MailModule } from '@modules/mail/mail.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentTransactionsModule } from '@modules/payment-transactions/payment-transactions.module';

import { CaslModule } from '../casl/casl.module';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CaslModule,
    OneCClientModule,
    MailModule,
    OrdersModule,
    PaymentTransactionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
