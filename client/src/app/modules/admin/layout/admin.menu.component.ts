import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

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
            routerLink: ['/'],
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
