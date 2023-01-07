import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '@shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SignedOutGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) { }

  canActivate(): boolean {
    if (!this.storageService.getItem('access_token')) {
      return true;
    } else {
      this.router.navigateByUrl('dashboard');
      return false;
    }
  }
}
