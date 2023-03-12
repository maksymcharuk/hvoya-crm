import { Component } from '@angular/core';

import { VerticalMenuItem } from '@shared/interfaces/vertical-menu-item.interface';

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.scss'],
})
export class ProductAttributesComponent {
  menu: VerticalMenuItem[] = [];

  constructor() {
    this.menu = [
      {
        label: 'Кольори',
        routerLink: ['colors'],
      },
      {
        label: 'Розміри',
        routerLink: ['sizes'],
      },
    ];
  }
}
