import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  items!: MenuItem[];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Statistics',
        icon: 'pi pi-pw pi-home',
      },
      {
        label: 'Products',
        icon: 'pi pi-pw pi-shopping-cart',
      },
      {
        label: 'Orders',
        icon: 'pi pi-pw pi-shopping-bag',
      },
      {
        label: 'Requests',
        icon: 'pi pi-pw pi-envelope',
      },
      {
        label: 'Favorites',
        icon: 'pi pi-pw pi-heart',
      },
      {
        label: 'Faq',
        icon: 'pi pi-pw pi-question-circle',
      },
    ];
  }
}
