import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';

import { BadRequestException, Injectable } from '@nestjs/common';

import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  private async uploadImage(
    file: Express.Multer.File,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  private async removeImages(publicIds: string[]) {
    return new Promise((resolve, reject) => {
      v2.api.delete_resources(publicIds, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async uploadImageToCloudinary(
    file: Express.Multer.File,
    options: UploadApiOptions,
  ) {
    return await this.uploadImage(file, options).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async removeImageFromCloudinary(publicIds: string[]) {
    return await this.removeImages(publicIds).catch(() => {
      throw new BadRequestException('File cannot be removed.');
    });
  }
}
