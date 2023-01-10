import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.userService.getUser();
    const roles = route.data['roles'];
    if (!user) return false;

    if (roles.includes(user.role)) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}

