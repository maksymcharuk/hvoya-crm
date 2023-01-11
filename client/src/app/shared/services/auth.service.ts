import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '@environment/environment';
import { SignInResponse } from '@shared/interfaces/sign-in-response';
import { SignInDTO } from '@shared/interfaces/sign-in.dto';
import { SignUpResponse } from '@shared/interfaces/sign-up-response';
import { SignUpDTO } from '@shared/interfaces/sign-up.dto';
import { StorageService } from '@shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  signIn(value: SignInDTO) {
    return this.http
      .post<SignInResponse>(`${environment.apiUrl}/auth/sign-in`, value)
      .pipe(
        tap(({ access_token }: SignInResponse) => {
          this.storageService.setItem('access_token', access_token);
        }),
      );
  }

  signUp(value: SignUpDTO) {
    return this.http
      .post<SignUpResponse>(`${environment.apiUrl}/auth/sign-up`, value)
      .pipe(
        tap(({ access_token }: SignUpResponse) => {
          this.storageService.setItem('access_token', access_token);
        }),
      );
  }
}
