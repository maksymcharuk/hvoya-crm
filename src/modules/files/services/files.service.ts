import { FileEntity } from '@entities/file.entity';
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/modules/cloudinary/services/cloudinary.service';
import { QueryRunner } from 'typeorm';

@Injectable()
export class FilesService {

    constructor(private cloudinaryService: CloudinaryService) { }

    async uploadFile(queryRunner: QueryRunner, file: Express.Multer.File): Promise<FileEntity> {
        const result = await this.cloudinaryService.uploadImageToCloudinary(file);

        return queryRunner.manager.save(FileEntity, {
            public_id: result?.public_id,
            url: result?.secure_url,
        });
    }

    async deleteFiles(queryRunner: QueryRunner, files: FileEntity[]): Promise<void> {
        await this.cloudinaryService.removeImageFromCloudinary(files.map((file) => file.public_id));
        await queryRunner.manager.delete(FileEntity, files);
    }

    async deleteFilesCloudinary(files: FileEntity[]): Promise<void> {
        await this.cloudinaryService.removeImageFromCloudinary(files.map((file) => file.public_id));
    }
}
