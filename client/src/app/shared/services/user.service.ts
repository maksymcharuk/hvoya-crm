import jwt_decode from 'jwt-decode';
import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { User } from '@shared/interfaces/entities/user.entity';
import { JwtTokenPayload } from '@shared/interfaces/jwt-payload.interface';
import { TokenUser } from '@shared/interfaces/token-user.interface';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private tokenService: TokenService, private http: HttpClient) { }

  getUser(): TokenUser | null {
    const token = this.tokenService.getToken();

    if (!token) return null;
    const decodedToken: JwtTokenPayload = jwt_decode(token);

    return decodedToken.user;
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${environment.apiUrl}/users`)
      .pipe(map((users) => users.map((user) => new User(user))));
  }

  getUserById(userId: string): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/${userId}`)
      .pipe(map((user) => new User(user)));
  }

  getUserByIdFull(userId: string): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/${userId}/full`)
      .pipe(map((user) => new User(user)));
  }

  confirmUser(userId: string): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/confirm`, { userId })
      .pipe(map((user) => new User(user)));
  }

  freezeUserToggle(userId: string): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/freeze-toggle`, { userId })
      .pipe(map((user) => new User(user)));
  }

  updateUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/update`, user)
      .pipe(map((user) => new User(user)));
  }
}
