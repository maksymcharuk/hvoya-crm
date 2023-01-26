import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SignInDTO,
  SignInDTOFormGroup,
} from '@shared/interfaces/dto/sign-in.dto';
import { AuthService } from '@shared/services/auth.service';
import { PoliciesService } from '@shared/services/policies.service';
import { UserService } from '@shared/services/user.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

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
    private policiesService: PoliciesService,
    private readonly messageService: MessageService
  ) { }

  onSubmit(value: SignInDTO) {
    this.isLoading = true;
    this.authService
      .signIn(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.policiesService.updateAbility();
        const user = this.userService.getUser();

        if (!user) {
          this.router.navigateByUrl('/');
          return;
        }

        const { role } = user;

        if (role === 'SuperAdmin' || role === 'Admin') {
          this.router.navigateByUrl('admin');
        } else {
          this.router.navigateByUrl('dashboard');
        }
      }, (error) => {
        if (error.status === 409) {
          if (!this.emailConfirmationSent) {
            this.authService.sendEmailConfirmation(value.email)
              .subscribe(() => {
                this.emailConfirmationSent = true;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Confirmation email sent',
                  detail: 'Please check your email to confirm your account',
                });
              });
          }
        }
      });
  }
}
