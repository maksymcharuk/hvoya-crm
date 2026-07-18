import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import config from '../../../config';
import { DatabaseService } from './database.service';

const { isDevelopment } = config();

@Injectable()
export class DatabaseTasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async backupDatabase() {
    if (isDevelopment()) {
      return;
    }
    return this.databaseService.backup();
  }
}
