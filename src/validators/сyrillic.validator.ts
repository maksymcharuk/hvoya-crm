import { registerDecorator, ValidationOptions } from "class-validator";
import { CyrillicRule } from "./сyrillic.rule";

export function Cyrillic(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Cyrillic',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CyrillicRule,
    });
  };
}