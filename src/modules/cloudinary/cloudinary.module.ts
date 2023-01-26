import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './providers/cloudinary';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule { }
