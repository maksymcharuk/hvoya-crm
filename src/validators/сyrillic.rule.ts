import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class CyrillicRule implements ValidatorConstraintInterface {
  async validate(value: string) {
    return /^[а-щА-ЩЬьЮюЯяЄєІіЇїҐґ]+$/.test(value);
  }

  defaultMessage() {
    return `ПІБ повинен містити лише літери українського алфавіту`;
  }
}