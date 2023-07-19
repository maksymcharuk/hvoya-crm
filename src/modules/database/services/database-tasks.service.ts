import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { DatabaseService } from './database.service';

@Injectable()
export class DatabaseTasksService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async backupDatabase() {
    return DatabaseService.backup();
  }
}
