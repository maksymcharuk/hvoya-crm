import { Component } from '@angular/core';

import { ICONS } from '@shared/constants/base.constants';
import {
  ORDER_NOTIFICATIONS,
  REQUEST_NOTIFICATION,
  USER_NOTIFICATION,
} from '@shared/constants/notification.constants';
import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth.service';
import { NotificationsService } from '@shared/services/notifications.service';
import { WebSocketGatewayService } from '@shared/services/websocket-gateway.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AccountService, NotificationsService, WebSocketGatewayService],
})
export class AdminComponent {
  notificationsNumber$ = this.notificationsService.notificationsNumber$;
  sidebarMenuItems = [
    {
      label: '',
      items: [
        {
          label: 'Головна',
          icon: 'pi pi-fw pi-home',
          routerLink: ['main'],
        },
        {
          label: 'Товари',
          icon: 'pi pi-fw pi-shopping-cart',
          items: [
            {
              label: 'Список товарів',
              icon: 'pi pi-fw pi-book',
              routerLink: ['products'],
            },
            {
              label: 'Створити',
              icon: 'pi pi-fw pi-plus-circle',
              routerLink: ['products/create'],
            },
            {
              label: 'Редагувати',
              icon: 'pi pi-fw pi-pencil',
              routerLink: ['products/edit'],
            },
            {
              label: 'Додаткові атрибути',
              icon: 'pi pi-fw pi-tags',
              routerLink: ['products/attributes'],
              routerLinkActiveOptions: { exact: false },
            },
            {
              label: 'Імпорт та експорт',
              icon: 'pi pi-fw pi-upload',
              routerLink: ['products/transfer'],
            },
          ],
        },
        {
          label: 'Замовлення',
          icon: `pi pi-fw ${ICONS.ORDER}`,
          routerLink: ['orders'],
          badge: '',
          title: ORDER_NOTIFICATIONS as any,
        },
        {
          label: 'Користувачі',
          icon: 'pi pi-fw pi-users',
          routerLink: ['users'],
          badge: '',
          title: USER_NOTIFICATION as any,
        },
        {
          label: 'Запити',
          icon: 'pi pi-fw pi-flag',
          routerLink: ['requests'],
          badge: '',
          title: REQUEST_NOTIFICATION as any,
        },
        {
          label: 'Запитання та відповіді',
          icon: 'pi pi-fw pi-question-circle',
          routerLink: ['faq'],
        },
        {
          label: 'Новини',
          icon: 'pi pi-volume-down',
          routerLink: ['posts'],
        },
      ],
    },
  ];

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private webSocketGatewayService: WebSocketGatewayService,
  ) {
    // TODO: find a way to remove this but keep initialization of webSocketGatewayService
    console.log(this.webSocketGatewayService);
  }

  logout() {
    this.authService.logout();
  }
}
