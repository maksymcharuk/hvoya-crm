import { Component } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  UpdateAdminSettingsDTO,
  UpdateAdminSettingsFormGroup,
} from '@shared/interfaces/dto/update-admin-settings.dto';
import { PasswordValidators } from '@shared/validators/password-validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  isLoading = false;

  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;

  updateProfileForm = this.formBuilder.group(
    {
      previousPassword: ['', [Validators.required]],
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
  ) as UpdateAdminSettingsFormGroup;

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(value: UpdateAdminSettingsDTO) {
    this.isLoading = true;
    console.log(value);
  }
}
