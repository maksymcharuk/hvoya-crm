import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'tr[app-request-list-item]',
  templateUrl: './request-list-item.component.html',
  styleUrls: ['./request-list-item.component.scss'],
  host: {
    '(click)': 'navigateToRequest()',
  },
})
export class RequestListItemComponent {

  @Input() adminView: boolean = false;
  @Input() request!: RequestEntity;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  navigateToRequest() {
    // TODO: create URL builder service and move this logic there
    const path = this.userService.getUser()?.isAnyAdmin
      ? '/admin'
      : '/dashboard';

    switch (this.request.requestType) {
      case 'Return':
        this.router.navigate([`${path}/requests/return-request/${this.request.number}`]);
        break;

      default:
        break;
    }
  }
}
