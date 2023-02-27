import { Table } from 'primeng/table';

import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { debounceTime, Subject, takeUntil } from 'rxjs';
import { GetUserResponse } from '@shared/interfaces/responses/get-user.response';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnDestroy {

  loading = true;
  searchForm = this.fb.group({
    search: [''],
  });
  globalFilterFields = ['firstName', 'lastName', 'middleName', 'email', 'phoneNumber'];

  private usersInternal: GetUserResponse[] = [];
  private destroy$ = new Subject();

  @Input() set users(users: GetUserResponse[] | null) {
    if (!users) {
      return;
    }
    this.usersInternal = users;
    this.loading = false;
  }

  @ViewChild('usersTable') usersTable!: Table;

  get users(): any[] {
    return this.usersInternal
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
