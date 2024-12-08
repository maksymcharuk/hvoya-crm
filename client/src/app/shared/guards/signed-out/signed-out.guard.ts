import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '@shared/services/storage.service';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SignedOutGuard  {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: UserService,
  ) {}

  canActivate(): boolean {
    if (!this.storageService.getItem('access_token')) {
      return true;
    } else {
      const user = this.userService.getUser();

      if (!user) {
        return true;
      }

      if (user.isAnyAdmin) {
        this.router.navigateByUrl('admin');
      } else {
        this.router.navigateByUrl('dashboard');
      }
      return false;
    }
  }
}
