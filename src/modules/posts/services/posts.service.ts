import { DataSource } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePostDto } from '@dtos/create-post.dto';
import { PostsPageOptionsDto } from '@dtos/posts-page-options.dto';
import { UpdatePostDto } from '@dtos/update-post.dto';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Role } from '@enums/role.enum';
import { SortOrder } from '@enums/sort-order.enum';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class PostsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findById(id: string, userId: string): Promise<PostEntity> {
    const manager = this.dataSource.manager;
    const post = await manager.findOneBy(PostEntity, { id });
    const user = await manager.findOneByOrFail(UserEntity, { id: userId });

    const ability = this.caslAbilityFactory.createForUser(user);

    if (!post || ability.cannot(Action.Read, post)) {
      throw new NotFoundException(
        'Запис запитання/відповідь з даним ID не знайдено',
      );
    }

    return post;
  }

  async getAll(
    userId: string,
    pageOptionsDto: PostsPageOptionsDto,
  ): Promise<Page<PostEntity>> {
    const user = await this.dataSource.manager.findOneByOrFail(UserEntity, {
      id: userId,
    });

    const query = this.dataSource.manager
      .createQueryBuilder(PostEntity, 'post')
      .leftJoinAndSelect('post.createdBy', 'createdBy')
      .leftJoinAndSelect('post.updatedBy', 'updatedBy');

    if (user.role === Role.User) {
      query.where('post.isPublished = :isPublished', { isPublished: true });
    }

    query
      .addOrderBy('post.createdAt', SortOrder.DESC)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const ability = this.caslAbilityFactory.createForUser(user);

    const itemCount = await query.getCount();
    let { entities } = await query.getRawAndEntities();

    const posts: PostEntity[] = entities.map((order) =>
      sanitizeEntity(ability, order),
    );

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(posts, pageMetaDto);
  }

  async create(userId: string, post: CreatePostDto): Promise<PostEntity> {
    const user = await this.dataSource.manager.findOneByOrFail(UserEntity, {
      id: userId,
    });

    return this.dataSource.manager.save(PostEntity, {
      ...post,
      createdBy: user,
      updatedBy: user,
    });
  }

  async update(
    id: string,
    post: UpdatePostDto,
    userId: string,
  ): Promise<PostEntity> {
    await this.dataSource.manager.save(PostEntity, {
      id,
      ...post,
      updatedBy: { id: userId },
    });
    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<PostEntity> {
    const post = await this.findById(id, userId);
    return this.dataSource.manager.remove(PostEntity, post);
  }
}
