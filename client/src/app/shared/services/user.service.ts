import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storageService: StorageService) { }

  getUser() {
    let token = this.storageService.getItem('access_token');

    if (!token) return null;
    let splittedToken = token.split('.')[1];

    if (!splittedToken) return null;
    return JSON.parse(atob(splittedToken)).user;
  }
}
