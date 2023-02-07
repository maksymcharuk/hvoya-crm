import { Component, Input } from '@angular/core';

import { VerticalMenuItem } from '@shared/interfaces/vertical-menu-item.interface';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
})
export class VerticalMenuComponent {
  @Input() menuItemList: VerticalMenuItem[] = [];
}
