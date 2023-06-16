import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '@modules/users/users.module';

import { SetupService } from './services/setup.service';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
