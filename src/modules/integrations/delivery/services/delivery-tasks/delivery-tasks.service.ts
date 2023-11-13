import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OrderDeliveryStatusUpdateService } from './services/order-delivery-status-update.service';
import { ReturnRequestDeliveryStatusUpdateService } from './services/return-request-delivery-status-update.service';

@Injectable()
export class DeliveryTasksService {
  constructor(
    private readonly orderDeliveryStatusUpdateService: OrderDeliveryStatusUpdateService,
    private readonly returnRequestDeliveryStatusUpdateService: ReturnRequestDeliveryStatusUpdateService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateStatuses() {
    await this.orderDeliveryStatusUpdateService.updateStatuses();
    await this.returnRequestDeliveryStatusUpdateService.updateStatuses();
  }
}
