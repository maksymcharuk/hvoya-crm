import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from '@entities/notification.entity';

import { UsersModule } from '../users/users.module';
import { NotificationListenerService } from './listeners/notification-listener.service';
import { NotificationService } from './services/notification/notification.service';
import { NotificationsController } from './notifications.controller';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    UsersModule,
    CaslModule,
    TypeOrmModule.forFeature([NotificationEntity])
  ],
  providers: [NotificationListenerService, NotificationService],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
