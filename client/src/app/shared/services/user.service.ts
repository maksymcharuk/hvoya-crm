import jwt_decode from 'jwt-decode';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JwtTokenPayload } from '@shared/interfaces/jwt-payload.interface';
import { TokenUser } from '@shared/interfaces/token-user.interface';
import { environment } from '@environment/environment';
import { GetUsersResponse } from '@shared/interfaces/responses/get-users.response';
import { GetUserResponse } from '@shared/interfaces/responses/get-user.response';

import { TokenService } from './token.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private tokenService: TokenService,
    private http: HttpClient) { }

  getUser(): TokenUser | null {
    const token = this.tokenService.getToken();

    if (!token) return null;
    const decodedToken: JwtTokenPayload = jwt_decode(token);

    return decodedToken.user;
  }

  getUsers(): Observable<GetUsersResponse> {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/users`);
  }

  getUserById(userId: number): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/users/${userId}`);
  }

  confirmUser(userId: number): Observable<GetUserResponse> {
    return this.http.post<GetUserResponse>(`${environment.apiUrl}/users/confirm`, { userId });
  }

  freezeUserToggle(userId: number): Observable<GetUserResponse> {
    return this.http.post<GetUserResponse>(`${environment.apiUrl}/users/freeze-toggle`, { userId });
  }
}
