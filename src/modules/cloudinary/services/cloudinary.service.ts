import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {

        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
    }

    async removeImages(publicIds: string[]) {

        return new Promise((resolve, reject) => {
            v2.api.delete_resources(publicIds, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    async uploadImageToCloudinary(file: Express.Multer.File) {
        return await this.uploadImage(file).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
    }

    async removeImageFromCloudinary(publicIds: string[]) {
        return await this.removeImages(publicIds).catch(() => {
            throw new BadRequestException('File cannot be removed.');
        });
    }
}
