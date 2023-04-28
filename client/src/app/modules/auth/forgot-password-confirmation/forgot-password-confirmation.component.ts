import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password-confirmation',
  templateUrl: './forgot-password-confirmation.component.html',
  styleUrls: ['./forgot-password-confirmation.component.scss'],
})
export class ForgotPasswordConfirmationComponent {
  email = '';

  constructor(private readonly route: ActivatedRoute) {
    this.email = this.route.snapshot.queryParams['email'];
  }
}
