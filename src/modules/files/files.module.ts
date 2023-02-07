import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileEntity } from '@entities/file.entity';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesService } from './services/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), CloudinaryModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
