import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AbilityBuilder } from '@casl/ability';
import { User } from '@shared/interfaces/user';
import { ADMIN_ACCESS_PAGES, AppAbility, SUPER_ADMIN_ACCESS_PAGES, USER_ACCESS_PAGES } from '@shared/roles/ability';
import { StorageService } from '@shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PoliciesGuard implements CanActivate {
  constructor(private storageService: StorageService, private ability: AppAbility) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let access_token = this.storageService.getItem('access_token');
    if (!access_token) return false;
    return this.updateAbility(this.getUser(access_token), state.url);
  }

  private getUser(token: string) {
    let splittedToken = token.split('.')[1];
    if (!splittedToken) return null;
    return JSON.parse(atob(splittedToken)).user;
  }


  private updateAbility(user: User, pageUrl: string) {
    const { can, rules } = new AbilityBuilder(AppAbility);

    if (user.role === 'SuperAdmin' && SUPER_ADMIN_ACCESS_PAGES.includes(pageUrl)) {
      can('all', 'Item');
      this.ability.update(rules);
      return true;
    } else if (user.role === 'Admin' && ADMIN_ACCESS_PAGES.includes(pageUrl)) {
      can('all', 'Item');
      this.ability.update(rules);
      return true;
    } else if (user.role === 'User' && USER_ACCESS_PAGES.includes(pageUrl)) {
      can('read', 'Item');
      this.ability.update(rules);
      return true;
    }

    return false;
  }
}

