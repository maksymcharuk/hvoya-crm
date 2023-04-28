import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { NotificationEntity } from '@entities/notification.entity';
import { Action } from '@enums/action.enum';

import { User } from '@decorators/user.decorator';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { NotificationService } from './services/notification/notification.service';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';

@Controller('notifications')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, NotificationEntity))
  getAll(@User('id') userId: number): Promise<NotificationEntity[]> {
    return this.notificationService.getAll(userId);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, NotificationEntity))
  check(@User('id') userId: number, @Body('id') id: number): Promise<NotificationEntity[]> {
    return this.notificationService.check(id, userId);
  }
}
