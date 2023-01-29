import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '@environment/environment';
import { SignInResponse } from '@shared/interfaces/responses/sign-in.response';
import { SignInDTO } from '@shared/interfaces/dto/sign-in.dto';
import { SignUpResponse } from '@shared/interfaces/responses/sign-up.response';
import { SignUpDTO } from '@shared/interfaces/dto/sign-up.dto';
import { ForgotPasswordDTO } from '@shared/interfaces/dto/forgot-password.dto';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  signIn(value: SignInDTO) {
    return this.http
      .post<SignInResponse>(`${environment.apiUrl}/auth/sign-in`, value)
      .pipe(
        tap(({ access_token }: SignInResponse) => {
          this.tokenService.setToken(access_token);
        }),
      );
  }

  signUp(value: SignUpDTO) {
    return this.http.post<SignUpResponse>(
      `${environment.apiUrl}/auth/sign-up`,
      value,
    );
  }

  confirmEmail(tokenObj: { confirmEmailToken: string }) {
    return this.http.post<SignUpResponse>(
      `${environment.apiUrl}/auth/confirm-email`,
      tokenObj,
    );
  }

  resetPassword(password: string, token: string | null) {
    return this.http.post<SignUpResponse>(
      `${environment.apiUrl}/auth/reset-password`,
      { password, token },
    );
  }

  forgotPassword(value: ForgotPasswordDTO) {
    return this.http.post<SignUpResponse>(
      `${environment.apiUrl}/auth/forgot-password`,
      value,
    );
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigateByUrl('/auth/sign-in');
  }

  sendEmailConfirmation(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/send-email-confirmation`, { email });
  }
}
