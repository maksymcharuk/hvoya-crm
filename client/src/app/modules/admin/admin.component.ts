import { Component } from '@angular/core';

import { AccountService } from '@shared/services/account.service';
import { NotificationsService } from '@shared/services/notifications.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [AccountService, NotificationsService],
})
export class AdminComponent { }
