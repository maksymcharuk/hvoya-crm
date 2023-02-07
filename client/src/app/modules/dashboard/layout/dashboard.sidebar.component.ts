import { Component, ElementRef } from '@angular/core';

import { AccountService } from '@shared/services/account.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './dashboard.sidebar.component.html',
})
export class DashboardSidebarComponent {
  profile$ = this.accountService.profile$;

  constructor(public el: ElementRef, private accountService: AccountService) {}
}
