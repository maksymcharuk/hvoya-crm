import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { AppAbility, Subjects } from '@shared/interfaces/casl.interface';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard  {
  constructor(
    private router: Router,
    private ability: AppAbility,
    private userService: UserService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const policies = route.data['policies'] as Array<Subjects>;
    const allowed = policies.every((policy) =>
      this.ability.can('visit', policy),
    );
    const user = this.userService.getUser();

    if (allowed) {
      return true;
    } else {
      this.router.navigateByUrl(
        route.url
          .map((segment) =>
            segment.path === 'admin' && user?.isUser
              ? 'dashboard'
              : segment.path,
          )
          .join('/'),
      );

      return false;
    }
  }
}
