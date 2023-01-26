import { FileTypeValidator as DefaultFileTypeValidator } from '@nestjs/common';

export class FileTypeValidator extends DefaultFileTypeValidator {
    override isValid(files: Express.Multer.File[]): boolean {
        return files.every((file) => super.isValid(file));
    }
}