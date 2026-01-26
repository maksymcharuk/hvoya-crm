import { UploadApiOptions } from 'cloudinary';
import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { FileEntity } from '@entities/file.entity';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';

@Injectable()
export class FilesService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadAutoFile(
    queryRunner: QueryRunner,
    file: Express.Multer.File,
    customOptions?: UploadApiOptions,
  ): Promise<FileEntity> {
    const options: UploadApiOptions = {
      resource_type: 'auto',
      use_filename: true,
      async: true,
      public_id: `${new Date().getTime()}-${file.originalname}`,
      ...customOptions,
    };

    return this.uploadFile(queryRunner, file, options);
  }

  async uploadFile(
    queryRunner: QueryRunner,
    file: Express.Multer.File,
    options: UploadApiOptions,
  ): Promise<FileEntity> {
    const result = await this.cloudinaryService.uploadImageToCloudinary(
      file,
      options,
    );

    return queryRunner.manager.save(FileEntity, {
      public_id: result?.public_id,
      url: result?.secure_url,
    });
  }

  async deleteFiles(
    queryRunner: QueryRunner,
    files: FileEntity[],
  ): Promise<void> {
    await this.cloudinaryService.removeImageFromCloudinary(
      files.map((file) => file.public_id),
    );
    await queryRunner.manager.delete(FileEntity, files);
  }

  async deleteFilesCloudinary(files: FileEntity[]): Promise<void> {
    await this.cloudinaryService.removeImageFromCloudinary(
      files.map((file) => file.public_id),
    );
  }
}
