import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import {
  UpdateUserProfileDTO,
  UpdateUserProfileFormGroup,
} from '@shared/interfaces/dto/update-user-profile.dto';
import { AccountService } from '@shared/services/account.service';
import { cyrillic } from '@shared/validators/cyrillic.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading = false;
  accountNumber: string = '';
  accountNumberCopied = false;

  updateProfileForm = this.formBuilder.group({
    phoneNumber: ['', Validators.required],
    lastName: ['', [Validators.required, cyrillic()]],
    firstName: ['', [Validators.required, cyrillic()]],
    middleName: ['', [Validators.required, cyrillic()]],
    storeName: ['', Validators.required],
    website: ['', Validators.required],
    bio: ['', Validators.required],
  }) as UpdateUserProfileFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
    private clipboard: Clipboard,
  ) { }

  ngOnInit(): void {
    this.accountService.profile$.subscribe((profile) => {
      if (profile) {
        this.updateProfileForm.patchValue({
          phoneNumber: profile.phoneNumber,
          lastName: profile.lastName,
          firstName: profile.firstName,
          middleName: profile.middleName,
          storeName: profile.storeName,
          website: profile.website,
          bio: profile.bio,
        });
        this.accountNumber = profile.accountNumber;
      }
    });
  }

  onSubmit(value: UpdateUserProfileDTO) {
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

  copyAccountNumber() {
    this.clipboard.copy(this.accountNumber);
    this.accountNumberCopied = true;
    this.messageService.add({
      severity: 'success',
      detail: 'Номер договору було скопійовано',
    });
  }
}
