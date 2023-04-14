import { Component } from '@angular/core';

import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth.service';
import { NotificationsService } from '@shared/services/notifications.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AccountService, NotificationsService],
})
export class AdminComponent {
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
          items: [
            {
              label: 'Список продуктів',
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
          icon: 'pi pi-fw pi-shopping-bag',
          routerLink: ['orders'],
        },
        {
          label: 'Користувачі',
          icon: 'pi pi-fw pi-users',
          routerLink: ['users'],
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

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
