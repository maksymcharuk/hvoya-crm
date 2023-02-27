import { Ability, AbilityClass } from '@casl/ability';

type Actions = 'allowed' | 'SuperUpdate';
export type Subjects = 'AdminPage' | 'DashboardPage' | 'UsersPage';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;
