import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {
  UpdateAdminProfileDTO,
  UpdateAdminProfileFormGroup,
} from '@shared/interfaces/dto/update-admin-profile.dto';

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
  }) as UpdateAdminProfileFormGroup;

  constructor(private formBuilder: FormBuilder) {}

  onSubmit(value: UpdateAdminProfileDTO) {
    this.isLoading = true;
    console.log(value);
  }
}
