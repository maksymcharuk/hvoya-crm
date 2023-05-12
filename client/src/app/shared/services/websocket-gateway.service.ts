import { Socket, io } from 'socket.io-client';

import { Injectable, OnDestroy } from '@angular/core';

import { environment } from '@environment/environment';
import { SocketEvent } from '@shared/enums/socket-event.enum';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';

import { NotificationsService } from './notifications.service';
import { TokenService } from './token.service';

@Injectable()
export class WebSocketGatewayService implements OnDestroy {
  private socket: Socket;

  constructor(
    private readonly tokenService: TokenService,
    private readonly notificationsService: NotificationsService,
  ) {
    // Create a WebSocket connection to the backend
    this.socket = io(environment.webSocketUrl, {
      extraHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`,
      },
    });

    // Register event handlers for the WebSocket events
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on(
      SocketEvent.NotificationCreate,
      (notification: NotificationEntity) => {
        this.notificationsService.notifications$.next([
          new NotificationEntity(notification),
          ...this.notificationsService.notifications$.getValue(),
        ]);
      },
    );
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  sendMessage(event: string, message: string) {
    this.socket.emit(event, message);
  }
}
