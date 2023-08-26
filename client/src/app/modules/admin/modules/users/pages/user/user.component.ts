import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FIELD_UPDATE_DEBOUNCE_TIME } from '@shared/constants/base.constants';
import { Role } from '@shared/enums/role.enum';
import {
  UpdateUserByAdminDTO,
  UpdateUserByAdminFormGroup,
} from '@shared/interfaces/dto/update-user-by-admin.dto';
import { User } from '@shared/interfaces/entities/user.entity';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user!: User;
  isFreezing: boolean = false;
  admins$ = this.userService.getAdmins();
  showConfirmUserDialog = false;
  userConfirmationForm!: FormGroup;
  submitting = false;
  isNoteSaving = false;
  currentUser = this.userService.getUser();

  readonly roleEnum = Role;
  private readonly destroy$ = new Subject<void>();

  userForm = this.fb.group({
    note: [''],
  }) as UpdateUserByAdminFormGroup;

  get noteControl(): AbstractControl {
    return this.userForm.get('note')!;
  }

  constructor(
    private readonly fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.userConfirmationForm = this.fb.group({
      managerId: ['', [Validators.required]],
    });

    this.route.params.subscribe((params) => {
      this.userService.getUserByIdFull(params['id']).subscribe((user: User) => {
        this.user = user;
        this.userForm.patchValue(
          {
            note: user.note,
          },
          {
            emitEvent: false,
          },
        );
        this.userConfirmationForm.patchValue(
          {
            managerId: user.manager?.id,
          },
          {
            emitEvent: false,
          },
        );
      });
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

  openConfirmUserDialog() {
    this.showConfirmUserDialog = true;
  }

  hideDialog() {
    this.showConfirmUserDialog = false;
  }

  confirmUser() {
    if (!this.userConfirmationForm.valid) {
      this.userConfirmationForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.userService
      .confirmUser({
        userId: this.user.id,
        managerId: this.userConfirmationForm.value.managerId,
      })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe((user: User) => {
        this.user = user;
        this.hideDialog();
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
      .subscribe((user: User) => {
        this.user = user;
        if (this.user.userFreezed) {
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
    this.userService
      .updateUserByAdmin(this.user.id, updateData)
      .pipe(finalize(() => (this.isNoteSaving = false)))
      .subscribe((user: User) => {
        this.user = user;
        this.messageService.add({
          severity: 'success',
          detail: 'Дані користувача оновлено',
        });
      });
  }
}
