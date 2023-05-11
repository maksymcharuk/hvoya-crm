import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { GetUserResponse } from '@shared/interfaces/responses/get-user.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/users/${id}`);
  }
}
