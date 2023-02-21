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
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/'],
          },
          {
            label: 'Products',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
              {
                label: 'Products',
                icon: 'pi pi-fw pi-book',
                routerLink: ['products'],
              },
              {
                label: 'Create',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['products/create'],
              },
              {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['products/edit'],
              },
            ],
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
