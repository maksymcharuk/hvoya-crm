import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  ChangePasswordDTO,
  ChangePasswordFormGroup,
} from '@shared/interfaces/dto/change-password.dto';
import { AccountService } from '@shared/services/account.service';
import { PasswordValidators } from '@shared/validators/password-validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  profile$ = this.accountService.profile$;
  isLoading = false;

  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;

  changePasswordForm = this.formBuilder.group(
    {
      currentPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          PasswordValidators.patternValidator(/\d/, { hasNumeric: true }),
          PasswordValidators.patternValidator(/[A-Z]/, { hasUpperCase: true }),
          PasswordValidators.patternValidator(/[a-z]/, { hasLowerCase: true }),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validator: PasswordValidators.MatchValidator,
    } as AbstractControlOptions,
  ) as ChangePasswordFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
  ) {}

  onChangePasswordSubmit(value: ChangePasswordDTO) {
    this.isLoading = true;
    this.accountService
      .changePassword(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Password was changed successfully',
        });
      });
  }
}
