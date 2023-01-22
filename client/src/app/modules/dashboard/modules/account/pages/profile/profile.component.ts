import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  UpdateUserProfileDTO,
  UpdateUserProfileFormGroup,
} from '@shared/interfaces/dto/update-user-profile.dto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  isLoading = false;

  updateProfileForm = this.formBuilder.group({
    phoneNumber: [''],
    firstName: [''],
    lastName: [''],
    city: [''],
    bio: [''],
    cardNumber: [''],
    cardholderName: [''],
  }) as UpdateUserProfileFormGroup;

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(value: UpdateUserProfileDTO) {
    this.isLoading = true;
    console.log(value);
  }
}
