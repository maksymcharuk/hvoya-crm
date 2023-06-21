import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder } from '@angular/forms';

import { Role } from '@shared/enums/role.enum';
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

  readonly roleEnum = Role;
  private readonly destroy$ = new Subject<void>();

  userForm = this.formBuilder.group({
    note: [''],
  });

  get noteControl(): AbstractControl {
    return this.userForm.get('note')!;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.userService
      .getUserByIdFull(this.route.snapshot.params['id'])
      .subscribe((user: User) => {
        this.user = user;
        this.userForm.patchValue({
          note: this.user.note,
        });
        this.noteControl.valueChanges
          .pipe(takeUntil(this.destroy$), debounceTime(700), distinctUntilChanged())
          .subscribe((note) => {
            this.user.note = note;
            this.updateUser();
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  confirmUser() {
    this.userService.confirmUser(this.user.id).subscribe((user: User) => {
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
      .subscribe((user: User) => {
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

  updateUser() {
    this.userService.updateUser(this.user).subscribe((user: User) => {
      this.user = user;
      this.messageService.add({
        severity: 'success',
        detail: 'Дані користувача оновлено',
      });
    });
  }
}
