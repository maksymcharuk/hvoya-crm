import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { JwtTokenPayload } from '@shared/interfaces/jwt-payload.interface';
import { TokenUser } from '@shared/interfaces/token-user.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private tokenService: TokenService) {}

  getUser(): TokenUser | null {
    const token = this.tokenService.getToken();

    if (!token) return null;
    const decodedToken: JwtTokenPayload = jwt_decode(token);

    return decodedToken.user;
  }
}
