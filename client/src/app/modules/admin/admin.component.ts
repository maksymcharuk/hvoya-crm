import { Component } from '@angular/core';
import { AccountService } from '@shared/services/account.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AccountService],
})
export class AdminComponent {}
