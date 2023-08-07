import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';

import { ReturnRequestsModule } from './return-requests/return-requests.module';
import { RequestService } from './services/request/request.service';
import { RequestController } from './controllers/request/request.controller';

import { CaslModule } from '@modules/casl/casl.module';
import { FilesModule } from '@modules/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      UserEntity,
    ]),
    ReturnRequestsModule,
    FilesModule,
    CaslModule,
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestsModule { }