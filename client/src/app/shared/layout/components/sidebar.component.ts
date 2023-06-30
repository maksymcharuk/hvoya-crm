import { MenuItem } from 'primeng/api';

import { Component, ElementRef, Input } from '@angular/core';

import { Role } from '@shared/enums/role.enum';
import { AccountService } from '@shared/services/account.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];

  profile$ = this.accountService.profile$;
  currentUser = this.userService.getUser();
  role = Role;

  constructor(
    public readonly el: ElementRef,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}
}
