import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '@shared/layout/services/layout.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'dashboard-menu',
  templateUrl: './dashboard.menu.component.html',
})
export class DashboardMenuComponent implements OnInit {
  model: MenuItem[] = [];

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
      {
        label: '',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/'],
          },
          {
            label: 'Products',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: ['products'],
          },
          {
            label: 'Order',
            icon: 'pi pi-fw pi-shopping-bag',
            routerLink: ['/'],
          },
          {
            label: 'Requests',
            icon: 'pi pi-fw pi-envelope',
            routerLink: ['/'],
          },
          {
            label: 'Favorites',
            icon: 'pi pi-fw pi-heart',
            routerLink: ['/'],
          },
          {
            label: 'FAQ',
            icon: 'pi pi-fw pi-question-circle',
            routerLink: ['/'],
          },
        ],
      },
    ];
  }
}
