import jwt_decode from 'jwt-decode';
import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { ConfirmUserDTO } from '@shared/interfaces/dto/confirm-user.dto';
import { SendAdminInvitationDTO } from '@shared/interfaces/dto/send-admin-invitation.dto';
import { UpdateUserByAdminDTO } from '@shared/interfaces/dto/update-user-by-admin.dto';
import { TokenUser } from '@shared/interfaces/entities/token-user.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { JwtTokenPayload } from '@shared/interfaces/jwt-payload.interface';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private tokenService: TokenService, private http: HttpClient) {}

  getUser(): TokenUser | null {
    const token = this.tokenService.getToken();

    if (!token) return null;
    const decodedToken: JwtTokenPayload = jwt_decode(token);

    return new TokenUser(decodedToken.user);
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${environment.apiUrl}/users`)
      .pipe(map((users) => users.map((user) => new User(user))));
  }

  getAdmins(): Observable<User[]> {
    return this.http
      .get<User[]>(`${environment.apiUrl}/users/admins`)
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

  updateUserByAdmin(
    userId: string,
    updateData: UpdateUserByAdminDTO,
  ): Observable<User> {
    return this.http
      .post<User>(
        `${environment.apiUrl}/users/${userId}/update-by-admin`,
        updateData,
      )
      .pipe(map((user) => new User(user)));
  }

  confirmUser(confirmUserDto: ConfirmUserDTO): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/confirm`, confirmUserDto)
      .pipe(map((user) => new User(user)));
  }

  freezeUserToggle(userId: string): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/freeze-toggle`, { userId })
      .pipe(map((user) => new User(user)));
  }

  sendAdminInvitation(
    sendAdminInvitationDTO: SendAdminInvitationDTO,
  ): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/users/send-admin-invitation`,
      sendAdminInvitationDTO,
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${userId}`);
  }
}
