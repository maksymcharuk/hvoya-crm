import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import config from '../../../config';
import { DatabaseService } from './database.service';

const { isDevelopment } = config();

@Injectable()
export class DatabaseTasksService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async backupDatabase() {
    if (isDevelopment()) {
      return;
    }
    return DatabaseService.backup();
  }
}
