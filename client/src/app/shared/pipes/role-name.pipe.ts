import { Pipe, PipeTransform } from '@angular/core';

import { Role } from '@shared/enums/role.enum';
import { getRoleName } from '@shared/maps/role.map';

@Pipe({ name: 'roleName' })
export class RoleNamePipe implements PipeTransform {
  transform(value: Role | undefined): string {
    return getRoleName(value);
  }
}
