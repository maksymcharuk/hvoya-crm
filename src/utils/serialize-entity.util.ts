import { PureAbility, Subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';

import { Action } from '@enums/action.enum';

import { pickExtended } from './pick-extended.util';

export function sanitizeEntity<T>(ability: PureAbility, entity: Subject): T {
  const updatableFields = permittedFieldsOf(ability, Action.Read, entity, {
    fieldsFrom: (rule) => rule.fields || [],
  });
  return pickExtended(entity, updatableFields) as T;
}
