import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import jwt_decode from 'jwt-decode';
import { JwtTokenPayload } from '@shared/interfaces/jwt-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private storageService: StorageService) {}

  getUser() {
    const token = this.storageService.getItem('access_token');

    if (!token) return null;
    const decodedToken: JwtTokenPayload = jwt_decode(token);

    return decodedToken.user;
  }
}
