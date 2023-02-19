import { MenuItem } from 'primeng/api';

import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

import { LayoutService } from '@shared/layout/services/layout.service';

@Component({
  selector: 'dashboard-menu',
  templateUrl: './dashboard.menu.component.html',
})
export class DashboardMenuComponent implements OnInit {
  model: MenuItem[] = [];

  constructor(public layoutService: LayoutService) {}

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
            routerLink: ['products'],
          },
          {
            label: 'Замовлення',
            icon: 'pi pi-fw pi-shopping-bag',
            routerLink: ['orders'],
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
          },
        ],
      },
    ];
  }
}
