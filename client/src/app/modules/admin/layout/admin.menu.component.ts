import { MenuItem } from 'primeng/api';

import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin.menu.component.html',
})
export class AdminMenuComponent implements OnInit {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
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
          {
            label: 'Запити',
            icon: 'pi pi-fw pi-envelope',
          },
          {
            label: 'Улюблені',
            icon: 'pi pi-fw pi-heart',
          },
          {
            label: 'Запитання та відповіді',
            icon: 'pi pi-fw pi-question-circle',
            routerLink: ['faq'],
          },
        ],
      },
    ];
  }
}
