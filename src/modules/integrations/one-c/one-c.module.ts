import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { OneCApiService } from './services/one-c-api/one-c-api.service';
import { OneCSyncService } from './services/one-c-sync/one-c-sync.service';
import { OneCTasksService } from './services/one-c-tasks/one-c-tasks.service';

@Module({
  imports: [HttpModule],
  providers: [OneCApiService, OneCSyncService, OneCTasksService],
  exports: [OneCApiService, OneCSyncService],
})
export class OneCModule {}
