import { Role } from '@shared/enums/role.enum';

const roleMap = new Map<Role, string>([
  [Role.SuperAdmin, 'Головний адміністратор'],
  [Role.Admin, 'Адміністратор'],
  [Role.User, 'Дропшипер'],
]);

export const getRoleName = (role: Role | undefined) => {
  return (role && roleMap.get(role)) || 'Не визначено';
};
