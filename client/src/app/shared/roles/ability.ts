import { Ability, AbilityClass } from '@casl/ability';

type Actions = 'allowed';
export type Subjects = 'AdminPage' | 'DashboardPage';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;
