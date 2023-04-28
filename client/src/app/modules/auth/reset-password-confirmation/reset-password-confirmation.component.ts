import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-confirmation',
  templateUrl: './reset-password-confirmation.component.html',
  styleUrls: ['./reset-password-confirmation.component.scss'],
})
export class ResetPasswordConfirmationComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/auth/sign-in']);
    }, 5000);
  }
}
