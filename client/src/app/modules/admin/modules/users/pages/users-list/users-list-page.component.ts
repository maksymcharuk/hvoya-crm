import { MessageService } from 'primeng/api';
import { BehaviorSubject, finalize } from 'rxjs';

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Role } from '@shared/enums/role.enum';
import { User } from '@shared/interfaces/entities/user.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { UserService } from '@shared/services/user.service';

@Component({
  templateUrl: './users-list-page.component.html',
  styleUrls: ['./users-list-page.component.scss'],
})
export class UsersListPageComponent {
  users$ = new BehaviorSubject<Page<User> | null>(null);
  showAdminInvitationDialog = false;
  adminInvitationLoading = false;

  adminInvitationForm!: FormGroup;
  roles = Object.values(Role).filter((role) => role !== Role.User);

  readonly userEntity = User;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {
    this.adminInvitationForm = this.fb.group({
      email: ['', Validators.required],
      role: [Role.Admin, Validators.required],
    });
  }

  loadUsers(pageOptions: PageOptions) {
    this.userService.getUsers(pageOptions).subscribe((orders) => {
      this.users$.next(orders);
    });
  }

  openAdminInvitationDialog() {
    this.showAdminInvitationDialog = true;
  }

  closeAdminInvitationDialog() {
    this.showAdminInvitationDialog = false;
  }

  sendAdminInvitation() {
    if (this.adminInvitationForm.invalid) {
      this.adminInvitationForm.markAllAsTouched();
      return;
    }

    this.adminInvitationLoading = true;
    this.userService
      .sendAdminInvitation(this.adminInvitationForm.value)
      .pipe(finalize(() => (this.adminInvitationLoading = false)))
      .subscribe(() => {
        this.closeAdminInvitationDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Запрошення надіслано',
          detail: `Пошта: ${this.adminInvitationForm.value.email}`,
        });
        this.adminInvitationForm.reset();
      });
  }
}
