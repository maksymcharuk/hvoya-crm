import { Injectable } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AppAbility, Subjects } from '@shared/roles/ability';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private location: Location, private ability: AppAbility) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const policies = route.data['policies'] as Array<Subjects>;
    const allowed = policies.every((policy) => this.ability.can('allowed', policy))

    if (allowed) {
      return true;
    } else {
      this.location.back();
      return false;
    }
  }
}

