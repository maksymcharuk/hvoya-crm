import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../client/src/environments/environment';
import { LoginResponse } from '../shared/interfaces/login-response';
import { LoginDTO } from '../shared/interfaces/login.dto';
import { StorageService } from '../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private storageService: StorageService) { }

  login(value: LoginDTO) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth`, value)
      .pipe(tap(({ access_token }: LoginResponse) => {
        this.storageService.setItem('access_token', access_token);
      }));
  }
}
