import { Component } from '@angular/core';

import { NotificationType } from '@shared/enums/notification-type.enum';
import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth.service';
import { NotificationsService } from '@shared/services/notifications.service';
import { WebSocketGatewayService } from '@shared/services/websocket-gateway.service';

import { UserBalanceService } from './modules/balance/services/user-balance.service';
import { CartService } from './modules/cart/services/cart/cart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    AccountService,
    CartService,
    UserBalanceService,
    NotificationsService,
    WebSocketGatewayService,
  ],
})
export class DashboardComponent {
  cartItemsNumber$ = this.cartService.cartItemsNumber$;
  notificationsNumber$ = this.notificationsService.notificationsNumber$;
  balance$ = this.userBalance.balance$;
  sidebarMenuItems = [
    {
      label: '',
      items: [
        {
          label: 'Головна',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/'],
        },
        {
          label: 'Продукти',
          icon: 'pi pi-fw pi-shopping-cart',
          routerLink: ['products'],
        },
        {
          label: 'Замовлення',
          icon: 'pi pi-fw pi-shopping-bag',
          routerLink: ['orders'],
          badge: '',
          title: NotificationType.Order,
        },
        // {
        //   label: 'Запити',
        //   icon: 'pi pi-fw pi-envelope',
        // },
        // {
        //   label: 'Улюблені',
        //   icon: 'pi pi-fw pi-heart',
        // },
        {
          label: 'Запитання та відповіді',
          icon: 'pi pi-fw pi-question-circle',
          routerLink: ['faq'],
        },
      ],
    },
  ];

  constructor(
    private cartService: CartService,
    private userBalance: UserBalanceService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private webSocketGatewayService: WebSocketGatewayService,
  ) {
    console.log(this.webSocketGatewayService);
  }

  logout() {
    this.authService.logout();
  }
}
