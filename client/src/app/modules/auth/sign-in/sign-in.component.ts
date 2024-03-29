import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppAbility } from '@shared/interfaces/casl.interface';
import {
  SignInDTO,
  SignInDTOFormGroup,
} from '@shared/interfaces/dto/sign-in.dto';
import { AuthService } from '@shared/services/auth.service';
import { PoliciesService } from '@shared/services/policies.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  isLoading = false;
  emailConfirmationSent: boolean = false;

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  }) as SignInDTOFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private appAbility: AppAbility,
    private policiesService: PoliciesService,
    private readonly messageService: MessageService,
  ) {}

  onSubmit(value: SignInDTO) {
    if (!this.signInForm.valid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService
      .signIn(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        () => {
          this.policiesService.update(this.appAbility);

          const user = this.userService.getUser();

          if (!user) {
            this.router.navigateByUrl('/');
            return;
          }

          if (user.isAnyAdmin) {
            this.router.navigate(['admin']);
          } else {
            this.router.navigate(['dashboard']);
          }
        },
        (error) => {
          if (error.status === 409) {
            if (!this.emailConfirmationSent) {
              this.authService
                .sendEmailConfirmation(value.email)
                .subscribe(() => {
                  this.emailConfirmationSent = true;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Лист з підтвердженням надіслано',
                    detail: 'Будь ласка, перевірте свою електронну пошту',
                  });
                });
            } else {
              this.messageService.add({
                severity: 'info',
                summary: 'Лист з підтвердженням надіслано',
                detail: 'Будь ласка, перевірте свою електронну пошту',
              });
            }
          }
        },
      );
  }
}
