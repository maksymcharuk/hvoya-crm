import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  UpdateUserProfileDTO,
  UpdateUserProfileFormGroup,
} from '@shared/interfaces/dto/update-user-profile.dto';
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
    location: [''],
    bio: [''],
    cardNumber: [''],
    cardholderName: [''],
  }) as UpdateUserProfileFormGroup;

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
          location: profile.location,
          bio: profile.bio,
          cardNumber: profile.cardNumber,
          cardholderName: profile.cardholderName,
        });
      }
    });
  }

  onSubmit(value: UpdateUserProfileDTO) {
    this.isLoading = true;
    this.accountService
      .updateProfile(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Profile updated successfully',
        });
      });
  }
}
