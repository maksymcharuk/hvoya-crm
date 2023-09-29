import { Module } from '@nestjs/common';

import { CaslModule } from '@modules/casl/casl.module';
import { FilesModule } from '@modules/files/files.module';

import { RequestContext } from './core/request-context';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { FundsWithdrawRequestsModule } from './strategies/funds-withdraw-requests/funds-withdraw-requests.module';
import { ReturnRequestsModule } from './strategies/return-requests/return-requests.module';

@Module({
  imports: [
    ReturnRequestsModule,
    FundsWithdrawRequestsModule,
    FilesModule,
    CaslModule,
  ],
  providers: [RequestContext, RequestsService],
  controllers: [RequestsController],
})
export class RequestsModule {}
