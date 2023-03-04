import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Role } from '@shared/enums/role.enum';
import { GetUserResponse } from '@shared/interfaces/responses/get-user.response';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user!: GetUserResponse;
  isFreezing: boolean = false;

  readonly roleEnum = Role;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserById(this.route.snapshot.params['id'])
      .subscribe((user: GetUserResponse) => {
        this.user = user;
      });
  }

  confirmUser() {
    this.userService
      .confirmUser(this.user.id)
      .subscribe((user: GetUserResponse) => {
        this.user = user;
        this.messageService.add({
          severity: 'success',
          detail: 'Користувача підтверджено',
        });
      });
  }

  confirmFreezeToggle() {
    this.confirmationService.confirm({
      accept: () => {
        this.freezeUserToggle();
      },
    });
  }

  freezeUserToggle() {
    this.isFreezing = true;
    this.userService
      .freezeUserToggle(this.user.id)
      .pipe(finalize(() => (this.isFreezing = false)))
      .subscribe((user: GetUserResponse) => {
        this.user = user;
        if (this.user.userFreezed) {
          this.messageService.add({
            severity: 'success',
            detail: 'Аканут користувача призупинено',
          });
        } else {
          this.messageService.add({
            severity: 'success',
            detail: 'Користувача розморожено',
          });
        }
      });
  }
}
