import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FIELD_UPDATE_DEBOUNCE_TIME } from '@shared/constants/base.constants';
import { Role } from '@shared/enums/role.enum';
import {
  UpdateUserByAdminDTO,
  UpdateUserByAdminFormGroup,
} from '@shared/interfaces/dto/update-user-by-admin.dto';
import { Order } from '@shared/interfaces/entities/order.entity';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user$ = new BehaviorSubject<User | null>(null);
  orders$ = new BehaviorSubject<Page<Order> | null>(null);
  paymentTransactions$ = new BehaviorSubject<Page<PaymentTransaction> | null>(
    null,
  );
  users$ = new BehaviorSubject<Page<User> | null>(null);
  isFreezing: boolean = false;
  admins$ = this.userService
    .getUsers(
      new PageOptions({
        rows: 0,
        filters: { roles: { value: [Role.Admin, Role.SuperAdmin] } },
      }),
    )
    .pipe(map((users) => users.data));
  showConfirmUserDialog = false;
  showDeleteDialog = false;
  userConfirmationForm!: FormGroup;
  submitting = false;
  isNoteSaving = false;
  currentUser = this.userService.getUser();

  readonly roleEnum = Role;
  private readonly destroy$ = new Subject<void>();

  userForm = this.fb.group({
    note: [''],
  }) as UpdateUserByAdminFormGroup;

  deleteUserForm = this.fb.group({
    confirmationString: [
      '',
      [Validators.required, this.validateConfirmationString.bind(this)],
    ],
  });

  get noteControl(): AbstractControl {
    return this.userForm.get('note')!;
  }

  constructor(
    private readonly fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.userConfirmationForm = this.fb.group({
      managerId: ['', [Validators.required]],
    });

    this.route.params
      .pipe(switchMap((params) => this.userService.getUserById(params['id'])))
      .subscribe((user) => {
        this.user$.next(user);
      });

    this.user$.subscribe((user) => {
      if (!user) {
        return;
      }

      this.userForm.patchValue({ note: user.note }, { emitEvent: false });
      this.userConfirmationForm.patchValue(
        { managerId: user.manager?.id },
        { emitEvent: false },
      );
    });

    this.noteControl.valueChanges
      .pipe(
        tap(() => (this.isNoteSaving = true)),
        takeUntil(this.destroy$),
        debounceTime(FIELD_UPDATE_DEBOUNCE_TIME),
        distinctUntilChanged((valueP, valueC) => {
          const equals = valueP === valueC;
          if (equals) {
            this.isNoteSaving = false;
          }
          return equals;
        }),
      )
      .subscribe((note) => {
        this.updateUserByAdmin({ note });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateConfirmationString(
    control: AbstractControl,
  ): ValidationErrors | null {
    const user = this.user$.getValue();

    if (!control.value || !user) {
      return null;
    }

    if (control.value !== `${user.lastName} ${user.firstName}`) {
      return { invalidConfirmationString: true };
    }

    return null;
  }

  openConfirmUserDialog() {
    this.showConfirmUserDialog = true;
  }

  hideUserConfirmDialog() {
    this.showConfirmUserDialog = false;
  }

  openDeleteUserDialog() {
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
  }

  confirmUser() {
    const user = this.user$.getValue();

    if (!this.userConfirmationForm.valid || !user) {
      this.userConfirmationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.userService
      .confirmUser({
        userId: user.id,
        managerId: this.userConfirmationForm.value.managerId,
      })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe((user: User) => {
        this.user$.next(user);
        this.hideUserConfirmDialog();
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
    const user = this.user$.getValue();

    if (!user) {
      return;
    }

    this.isFreezing = true;
    this.userService
      .freezeUserToggle(user.id)
      .pipe(finalize(() => (this.isFreezing = false)))
      .subscribe((user: User) => {
        this.user$.next(user);
        if (user.userFreezed) {
          this.messageService.add({
            severity: 'success',
            detail: 'Акаунт користувача призупинено',
          });
        } else {
          this.messageService.add({
            severity: 'success',
            detail: 'Користувача розморожено',
          });
        }
      });
  }

  updateUserByAdmin(updateData: UpdateUserByAdminDTO) {
    const user = this.user$.getValue();

    if (!user) {
      return;
    }

    this.userService
      .updateUserByAdmin(user.id, updateData)
      .pipe(finalize(() => (this.isNoteSaving = false)))
      .subscribe((user: User) => {
        this.user$.next(user);
        this.messageService.add({
          severity: 'success',
          detail: 'Дані користувача оновлено',
        });
      });
  }

  deleteUser() {
    const user = this.user$.getValue();

    if (!this.deleteUserForm.valid || !user) {
      this.deleteUserForm.markAllAsTouched();
      return;
    }

    this.userService.deleteUser(user.id).subscribe(() => {
      this.closeDeleteDialog();
      this.messageService.add({
        severity: 'success',
        detail: 'Користувача видалено',
      });
      this.router.navigate(['/admin/users']);
    });
  }

  onLoadOrders(pageOptions: PageOptions) {
    const user = this.user$.getValue();

    if (!user) {
      return;
    }

    this.userService
      .getUserOrders(user.id, pageOptions)
      .subscribe((orders) => this.orders$.next(orders));
  }

  onLoadPaymentTransactions(pageOptions: PageOptions) {
    const user = this.user$.getValue();

    if (!user) {
      return;
    }

    this.userService
      .getUserPaymentTransactions(user.id, pageOptions)
      .subscribe((paymentTransactions) =>
        this.paymentTransactions$.next(paymentTransactions),
      );
  }

  onLoadUsers(pageOptions: PageOptions) {
    const user = this.user$.getValue();

    if (!user) {
      return;
    }

    this.userService
      .getAdminUsers(user.id, pageOptions)
      .subscribe((users) => this.users$.next(users));
  }
}
