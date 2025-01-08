import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '@modules/casl/casl.module';
import { UsersModule } from '@modules/users/users.module';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CaslModule, UsersModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
