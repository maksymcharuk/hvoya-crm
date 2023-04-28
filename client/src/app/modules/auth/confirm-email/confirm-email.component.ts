import { delay } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const confirmEmailToken = this.route.snapshot.queryParams['token'];
    this.authService
      .confirmEmail({ confirmEmailToken })
      .pipe(delay(5000))
      .subscribe(() => {
        this.router.navigateByUrl('auth/sign-in');
      });
  }
}
