import { Ability, AbilityClass } from '@casl/ability';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'all';
type Subjects = 'Item' | 'Post';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export const SUPER_ADMIN_ACCESS_PAGES = ['/dashboard'];
export const ADMIN_ACCESS_PAGES = ['/dashboard'];
export const USER_ACCESS_PAGES = ['/dashboard'];