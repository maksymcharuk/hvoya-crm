import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FundsWithdrawRequestEntity } from '@entities/funds-withdraw-request.entity';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';
import { FilesModule } from '@modules/files/files.module';
import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';

import { FundsWithdrawRequestsStrategy } from './funds-withdraw-requests.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RequestEntity,
      FundsWithdrawRequestEntity,
    ]),
    FilesModule,
    CaslModule,
    OneCClientModule,
  ],
  providers: [FundsWithdrawRequestsStrategy],
  exports: [FundsWithdrawRequestsStrategy],
})
export class FundsWithdrawRequestsModule {}
