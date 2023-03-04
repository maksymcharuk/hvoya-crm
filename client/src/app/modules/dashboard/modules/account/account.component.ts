import { Component } from '@angular/core';

import { VerticalMenuItem } from '@shared/interfaces/vertical-menu-item.interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  menu: VerticalMenuItem[] = [];

  constructor() {
    this.menu = [
      {
        label: 'Профіль',
        routerLink: ['profile'],
      },
      {
        label: 'Налаштування',
        routerLink: ['settings'],
      },
    ];
  }
}
