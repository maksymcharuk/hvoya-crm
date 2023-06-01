import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { User } from '@shared/interfaces/entities/user.entity';
import { NotificationsService } from '@shared/services/notifications.service';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnDestroy {
  notifications$ = this.notificationsService.notifications$;
  loading = true;
  searchForm = this.fb.group({
    search: [''],
  });
  globalFilterFields = [
    'accountNumber',
    'firstName',
    'lastName',
    'middleName',
    'email',
    'phoneNumber',
  ];
  userEntity = User;

  private usersInternal: User[] = [];
  private destroy$ = new Subject();

  @Input() set users(users: User[] | null) {
    if (!users) {
      return;
    }
    this.usersInternal = users;
    this.loading = false;
  }

  @ViewChild('usersTable') usersTable!: Table;

  get users(): any[] {
    return this.usersInternal;
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(
    private fb: FormBuilder,
    private readonly notificationsService: NotificationsService,
  ) {
    this.searchControl?.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.usersTable.filterGlobal(query, 'contains');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  showUserNotification(user: User, notificationList: NotificationEntity[] | null) {
    if (!notificationList) {
      return;
    }
    const notification = notificationList.find((notification) => {
      return notification.data.id === user.id;
    });
    user.notification = notification;
    return notification ? !notification.checked : false;
  }

  checkUserNotification(user: User) {
    if (user.notification) {
      this.notificationsService.checkNotification(user.notification.id);
    }
  }
}
