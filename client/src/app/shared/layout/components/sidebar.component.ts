import { MenuItem } from 'primeng/api';

import { Component, ElementRef, Input } from '@angular/core';

import { AccountService } from '@shared/services/account.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];

  profile$ = this.accountService.profile$;

  constructor(public el: ElementRef, private accountService: AccountService) {}
}
