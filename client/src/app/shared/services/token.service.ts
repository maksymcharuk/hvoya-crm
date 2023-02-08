import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'access_token';

  constructor(private storageService: StorageService) {}

  getToken() {
    return this.storageService.getItem(this.tokenKey);
  }

  setToken(token: string) {
    this.storageService.setItem(this.tokenKey, token);
  }

  removeToken() {
    this.storageService.removeItem(this.tokenKey);
  }
}
