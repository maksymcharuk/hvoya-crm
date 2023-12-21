import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '../casl/casl.module';
import { PostsController } from './posts.controller';
import { PostsService } from './services/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity]), CaslModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
