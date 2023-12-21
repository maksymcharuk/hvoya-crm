import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { CreatePostDto } from '@dtos/create-post.dto';
import { PostsPageOptionsDto } from '@dtos/posts-page-options.dto';
import { UpdatePostDto } from '@dtos/update-post.dto';
import { PostEntity } from '@entities/post.entity';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { PostsService } from './services/posts.service';

@Controller('post')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, PostEntity))
  getAll(
    @User('id') userId: string,
    @Query() postsPageOptionsDto: PostsPageOptionsDto,
  ): Promise<Page<PostEntity>> {
    return this.postsService.getAll(userId, postsPageOptionsDto);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, PostEntity))
  findById(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<PostEntity> {
    return this.postsService.findById(id, userId);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, PostEntity),
  )
  create(
    @User('id') userId: string,
    @Body() post: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.create(userId, post);
  }

  @Put(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, PostEntity),
  )
  update(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, post, userId);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, PostEntity),
  )
  delete(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<PostEntity> {
    return this.postsService.delete(id, userId);
  }
}
