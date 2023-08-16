import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'Cyrillic' })
export class CyrillicRule implements ValidatorConstraintInterface {
  validate(value: string) {
    return /^[а-щА-ЩЬьЮюЯяЄєІіЇїҐґ]+$/.test(value);
  }

  defaultMessage() {
    return `Cyrillic validator error`;
  }
}
