import { MaxFileSizeValidator as DefaultMaxFileSizeValidator } from '@nestjs/common';

export class MaxFilesSizeValidator extends DefaultMaxFileSizeValidator {
  override isValid(files: Express.Multer.File[]): boolean {
    return files.every((file) => super.isValid(file));
  }
}
