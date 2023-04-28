import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-up-confirmation',
  templateUrl: './sign-up-confirmation.component.html',
  styleUrls: ['./sign-up-confirmation.component.scss'],
})
export class SignUpConfirmationComponent {
  email = '';

  constructor(private readonly route: ActivatedRoute) {
    this.email = this.route.snapshot.queryParams['email'];
  }
}
