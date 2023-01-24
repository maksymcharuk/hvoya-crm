import { Component } from '@angular/core';
import { AccountService } from '@shared/services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AccountService],
})
export class DashboardComponent {}
