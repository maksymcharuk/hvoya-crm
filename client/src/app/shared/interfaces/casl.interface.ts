import { AbilityClass, PureAbility } from '@casl/ability';

export type Actions =
  // Basic actions
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  // Pages
  | 'visit';

export type Subjects =
  // Pages
  | 'admin.page'
  | 'dashboard.page'
  // Entities
  | 'user.entity'
  | 'faq.entity';

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;
