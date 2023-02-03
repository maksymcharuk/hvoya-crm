import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { FilesService } from './services/files.service';

import { FileEntity } from '@entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), CloudinaryModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule { }
