import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OneCSyncService } from '../one-c-sync/one-c-sync.service';

@Injectable()
export class OneCTasksService {
  constructor(private readonly oneCSyncService: OneCSyncService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateOrderDeliveryStatuses() {
    return this.oneCSyncService.syncProducts();
  }
}
