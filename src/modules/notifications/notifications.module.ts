import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from '@entities/notification.entity';
import { WSocketModule } from '@gateways/websocket/websocket.module';

import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { NotificationListenerService } from './listeners/notification-listener.service';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from './services/notification/notification.service';

@Module({
  imports: [
    UsersModule,
    CaslModule,
    WSocketModule,
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  providers: [NotificationListenerService, NotificationService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
