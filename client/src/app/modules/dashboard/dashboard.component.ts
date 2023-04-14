import { Component } from '@angular/core';

import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth.service';
import { NotificationsService } from '@shared/services/notifications.service';

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
  ],
})
export class DashboardComponent {
  cartItemsNumber$ = this.cartService.cartItemsNumber$;
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
  ) {}

  logout() {
    this.authService.logout();
  }
}
