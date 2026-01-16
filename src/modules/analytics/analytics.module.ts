import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceEntity } from '@entities/balance.entity';
import { OrderItemEntity } from '@entities/order-item.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderEntity } from '@entities/order.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';
import { UsersModule } from '@modules/users/users.module';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderEntity,
      BalanceEntity,
      OrderReturnRequestEntity,
      OrderItemEntity,
      ProductVariantEntity,
      ProductPropertiesEntity,
      ProductBaseEntity,
    ]),
    CaslModule,
    UsersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
