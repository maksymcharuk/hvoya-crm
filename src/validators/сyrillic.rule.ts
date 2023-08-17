import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'Cyrillic' })
export class CyrillicRule implements ValidatorConstraintInterface {
  validate(value: string) {
    return /^[А-Яа-яІіЇїЄєҐґ\s-]*$/.test(value);
  }

  defaultMessage() {
    return `Cyrillic validator error`;
  }
}
