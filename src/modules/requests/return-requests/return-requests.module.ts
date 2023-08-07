import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { OrderReturnRequestItemEntity } from '@entities/order-return-request-item.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { ReturnRequestController } from './controllers/return-request/return-request.controller';
import { ReturnRequestService } from './services/return-request/return-request.service';

import { FilesModule } from '@modules/files/files.module';
import { CaslModule } from '@modules/casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderReturnRequestEntity,
      OrderReturnRequestItemEntity,
      OrderReturnDeliveryEntity,
    ]),
    ReturnRequestsModule,
    FilesModule,
    CaslModule,
  ],
  controllers: [ReturnRequestController],
  providers: [ReturnRequestService],
  exports: [ReturnRequestService],
})
export class ReturnRequestsModule { }
