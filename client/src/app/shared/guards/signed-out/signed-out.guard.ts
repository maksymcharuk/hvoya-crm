import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '@shared/services/storage.service';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SignedOutGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router, private userService: UserService,) { }

  canActivate(): boolean {
    if (!this.storageService.getItem('access_token')) {
      return true;
    } else {
      const { role } = this.userService.getUser();
      if (role === 'SuperAdmin' || role === 'Admin') {
        this.router.navigateByUrl('admin');
      } else {
        this.router.navigateByUrl('dashboard');
      }
      return false;
    }
  }
}
