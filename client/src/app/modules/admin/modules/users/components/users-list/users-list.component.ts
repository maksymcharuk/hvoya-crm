import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, debounceTime, map, takeUntil } from 'rxjs';

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Role } from '@shared/enums/role.enum';
import { User } from '@shared/interfaces/entities/user.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { UserService } from '@shared/services/user.service';

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
  userEntity = User;
  managers$ = this.userService
    .getUsers(
      new PageOptions({
        rows: 0,
        filters: { roles: { value: [Role.Admin, Role.SuperAdmin] } },
      }),
    )
    .pipe(map((users) => users.data));

  private usersInternal: Page<User> | null = null;
  private destroy$ = new Subject();
  @Input() set users(users: Page<User> | null) {
    this.usersInternal = users;
    if (users) {
      this.loading = false;
    }
  }
  @Input() hideManager: boolean = false;
  @Output() onLoadData = new EventEmitter<PageOptions>();

  @ViewChild('usersTable') usersTable!: Table;

  get users(): Page<User> | null {
    return this.usersInternal;
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(private fb: FormBuilder, private userService: UserService) {
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

  filterByManager(managers: User[]) {
    this.usersTable.filter(
      managers.map((manager) => manager.id),
      'managerIds',
      'in',
    );
  }

  onLazyLoad(event: LazyLoadEvent) {
    this.loading = true;
    if (this.users) {
      this.users.data = [];
    }
    this.onLoadData.emit(new PageOptions(event));
  }
}
