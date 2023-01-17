import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  dots: string = '';

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    let dotsInterval = setInterval(() => {
      if (this.dots.length < 3) {
        this.dots += '.';
      } else {
        this.dots = '';
      }
    }, 500);

    this.activatedRoute.queryParams.subscribe((params) => {
      const confirmEmailToken = params['token'];

      this.authService.confirmEmail({ confirmEmailToken })
        .pipe(delay(3000))
        .subscribe(() => {
          clearInterval(dotsInterval);
          this.router.navigateByUrl('auth/sign-in');
        });
    });
  }

}
