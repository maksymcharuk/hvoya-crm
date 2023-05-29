import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { User } from '@shared/interfaces/entities/user.entity';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnDestroy {
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

  constructor(private fb: FormBuilder) {
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
}
