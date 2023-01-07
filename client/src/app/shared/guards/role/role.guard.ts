import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.userService.getUser();
    const roles = route.data['roles'];
    if (!user) return false;

    if (roles.includes(user.role)) {
      return true;
    } else {
      return false;
    }
  }
}

