import { Injectable } from '@angular/core';
import { AbilityBuilder } from '@casl/ability';

import { Role } from '@shared/enums/role.enum';
import { AppAbility } from '@shared/interfaces/casl.interface';

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
      case Role.SuperAdmin:
        can('visit', 'admin.page');
        can('update', 'user.entity');
        can(['create', 'update'], 'faq.entity');
        break;
      case Role.Admin:
        can('visit', 'admin.page');
        can(['create', 'update'], 'faq.entity');
        break;
      case Role.User:
        can('visit', 'dashboard.page');
        break;
    }

    this.ability.update(rules);
  }
}
