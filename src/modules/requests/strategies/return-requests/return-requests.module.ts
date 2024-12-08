import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { OrderReturnRequestItemEntity } from '@entities/order-return-request-item.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';
import { FilesModule } from '@modules/files/files.module';
import { DeliveryModule } from '@modules/integrations/delivery/delivery.module';
import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';

import { ReturnRequestsStrategy } from './return-requests.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderReturnRequestEntity,
      OrderReturnRequestItemEntity,
      OrderReturnDeliveryEntity,
    ]),
    FilesModule,
    CaslModule,
    OneCClientModule,
    DeliveryModule,
  ],
  providers: [ReturnRequestsStrategy],
  exports: [ReturnRequestsStrategy],
})
export class ReturnRequestsModule {}
