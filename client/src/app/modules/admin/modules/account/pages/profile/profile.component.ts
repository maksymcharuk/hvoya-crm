import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  UpdateAdminProfileDTO,
  UpdateAdminProfileFormGroup,
} from '@shared/interfaces/dto/update-admin-profile.dto';
import { AccountService } from '@shared/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading = false;

  updateProfileForm = this.formBuilder.group({
    phoneNumber: [''],
    firstName: [''],
    lastName: [''],
  }) as UpdateAdminProfileFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.accountService.profile$.subscribe((profile) => {
      if (profile) {
        this.updateProfileForm.patchValue({
          phoneNumber: profile.phoneNumber,
          firstName: profile.firstName,
          lastName: profile.lastName,
        });
      }
    });
  }

  onSubmit(value: UpdateAdminProfileDTO) {
    this.isLoading = true;
    this.accountService
      .updateProfile(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Профіль updated successfully',
        });
      });
  }
}
