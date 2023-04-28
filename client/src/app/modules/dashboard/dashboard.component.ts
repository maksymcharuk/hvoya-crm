import { Component } from '@angular/core';

import { AccountService } from '@shared/services/account.service';
import { NotificationsService } from '@shared/services/notifications.service';

import { UserBalanceService } from './modules/balance/services/user-balance.service';
import { CartService } from './modules/cart/services/cart/cart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AccountService, CartService, UserBalanceService, NotificationsService],
})
export class DashboardComponent { }
