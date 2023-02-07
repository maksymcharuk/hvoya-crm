import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { GetUserResponse } from '@shared/interfaces/responses/get-user.response';
import { GetUsersResponse } from '@shared/interfaces/responses/get-users.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/users/${id}`);
  }

  getUsers(): Observable<GetUsersResponse> {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/users`);
  }
}
