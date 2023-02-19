import { Component } from '@angular/core';

import { AccountService } from '@shared/services/account.service';

import { CartService } from './modules/cart/services/cart/cart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AccountService, CartService],
})
export class DashboardComponent {}
