import { Component } from '@angular/core';
import { UserService } from '@shared/services/user.service';

@Component({
  templateUrl: './users-list-page.component.html',
  styleUrls: ['./users-list-page.component.scss']
})
export class UsersListPageComponent {
  users$ = this.userService.getUsers();

  constructor(private userService: UserService) { }
}
