import { Component, ElementRef } from '@angular/core';
import { AccountService } from '@shared/services/account.service';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin.sidebar.component.html',
})
export class AdminSidebarComponent {
  profile$ = this.accountService.profile$;

  constructor(public el: ElementRef, private accountService: AccountService) {}
}
