import { Injectable } from '@angular/core';
import { AbilityBuilder } from '@casl/ability';
import { AppAbility } from '@shared/roles/ability';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  constructor(private ability: AppAbility, private userService: UserService) {}

  updateAbility() {
    const user = this.userService.getUser();
    if (!user) return;

    const { can, rules } = new AbilityBuilder(AppAbility);

    switch (user.role) {
      case 'SuperAdmin':
        can('allowed', 'AdminPage');
        break;
      case 'Admin':
        can('allowed', 'AdminPage');
        break;
      case 'User':
        can('allowed', 'DashboardPage');
        break;
    }

    this.ability.update(rules);
  }
}
