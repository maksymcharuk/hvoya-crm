import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import {
  UpdateAdminProfileDTO,
  UpdateAdminProfileFormGroup,
} from '@shared/interfaces/dto/update-admin-profile.dto';
import { AccountService } from '@shared/services/account.service';
import { cyrillic } from '@shared/validators/cyrillic.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading = false;

  updateProfileForm = this.formBuilder.group({
    phoneNumber: ['', Validators.required],
    lastName: ['', [Validators.required, cyrillic()]],
    firstName: ['', [Validators.required, cyrillic()]],
    middleName: ['', [Validators.required, cyrillic()]],
  }) as UpdateAdminProfileFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.accountService.profile$.subscribe((profile) => {
      if (profile) {
        this.updateProfileForm.patchValue({
          phoneNumber: profile.phoneNumber,
          lastName: profile.lastName,
          firstName: profile.firstName,
          middleName: profile.middleName,
        });
      }
    });
  }

  onSubmit(value: UpdateAdminProfileDTO) {
    if (!this.updateProfileForm.valid) {
      this.updateProfileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.accountService
      .updateProfile(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Профіль було успішно оновлено',
        });
      });
  }
}
