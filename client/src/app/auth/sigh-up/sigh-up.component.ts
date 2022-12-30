import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { PasswordValidators } from "../../shared/validators/password-validator";


@Component({
  selector: 'app-sigh-up',
  templateUrl: './sigh-up.component.html',
  styleUrls: ['./sigh-up.component.scss']
})
export class SighUpComponent implements OnInit {

  hasLowerCase: boolean | undefined = true;
  hasUpperCase: boolean | undefined = true;
  hasNumeric: boolean | undefined = true;
  hasMinLength: boolean | undefined = true;

  signUpForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8),
    PasswordValidators.patternValidator(/\d/, { hasNumeric: true }),
    PasswordValidators.patternValidator(/[A-Z]/, { hasUpperCase: true }),
    PasswordValidators.patternValidator(/[a-z]/, { hasLowerCase: true })]],
    confirmPassword: ['', Validators.required]
  },
    {
      validator: PasswordValidators.MatchValidator
    } as AbstractControlOptions
  );

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signUpForm.valueChanges.subscribe(() => {
      this.getPasswordErrors();
    });
  }

  onSubmit() { }

  getPasswordErrors() {
    if (this.signUpForm.get('password')?.value) {
      this.hasLowerCase = this.signUpForm.get('password')?.hasError('hasLowerCase');
      this.hasUpperCase = this.signUpForm.get('password')?.hasError('hasUpperCase');
      this.hasNumeric = this.signUpForm.get('password')?.hasError('hasNumeric');
      this.hasMinLength = this.signUpForm.get('password')?.hasError('minlength');
    } else {
      this.hasLowerCase = true;
      this.hasUpperCase = true;
      this.hasNumeric = true;
      this.hasMinLength = true;
    }
  }
}
