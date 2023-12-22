import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { NotificationsPageOptionsDto } from '@dtos/notifications-page-options.dto';
import { NotificationEntity } from '@entities/notification.entity';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { NotificationService } from './services/notification/notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, NotificationEntity),
  )
  getAll(
    @User('id') userId: string,
    @Query() pageOptionsDto: NotificationsPageOptionsDto,
  ): Promise<Page<NotificationEntity>> {
    return this.notificationService.getAll(userId, pageOptionsDto);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, NotificationEntity),
  )
  check(
    @User('id') userId: string,
    @Body('id') id: string,
    @Query() pageOptionsDto: NotificationsPageOptionsDto,
  ): Promise<Page<NotificationEntity>> {
    return this.notificationService.check(id, userId, pageOptionsDto);
  }
}
