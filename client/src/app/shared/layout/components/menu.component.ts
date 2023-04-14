import { MenuItem } from 'primeng/api';

import { Input } from '@angular/core';
import { Component } from '@angular/core';

import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  @Input() menuItems: MenuItem[] = [];

  constructor(public layoutService: LayoutService) {}
}
