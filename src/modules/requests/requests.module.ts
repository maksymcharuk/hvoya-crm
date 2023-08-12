import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';
import { FilesModule } from '@modules/files/files.module';

import { RequestContext } from './core/request-context';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ReturnRequestStrategy } from './strategies/return-requests/return-request.strategy';
import { ReturnRequestsModule } from './strategies/return-requests/return-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEntity, UserEntity]),
    ReturnRequestsModule,
    FilesModule,
    CaslModule,
  ],
  providers: [RequestContext, RequestService, ReturnRequestStrategy],
  controllers: [RequestController],
})
export class RequestsModule {}
