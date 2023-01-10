import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInDTO, SignInDTOFormGroup } from '@shared/interfaces/sign-in.dto';
import { AuthService } from '@shared/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  isLoading = false;

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  }) as SignInDTOFormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(value: SignInDTO) {
    this.isLoading = true;
    this.authService
      .signIn(value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.router.navigateByUrl('dashboard');
      });
  }
}
