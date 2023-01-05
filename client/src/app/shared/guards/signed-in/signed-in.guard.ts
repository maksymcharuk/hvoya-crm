import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {

  constructor(private storageService: StorageService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.storageService.getItem('access_token')) {
      return true;
    } else {
      this.router.navigateByUrl('auth/sign-in');
      return false;
    }
  }

}
