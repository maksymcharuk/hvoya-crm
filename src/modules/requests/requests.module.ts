import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';
import { FilesModule } from '@modules/files/files.module';

import { RequestContext } from './core/request-context';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { ReturnRequestsModule } from './strategies/return-requests/return-requests.module';
import { ReturnRequestsStrategy } from './strategies/return-requests/return-requests.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEntity, UserEntity]),
    ReturnRequestsModule,
    FilesModule,
    CaslModule,
  ],
  providers: [RequestContext, RequestsService, ReturnRequestsStrategy],
  controllers: [RequestsController],
})
export class RequestsModule {}
