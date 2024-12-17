import { createEffect, ofType } from '@ngrx/effects';
import { ActionsSubject } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Post } from '@shared/interfaces/entities/post.entity';
import { Page } from '@shared/interfaces/page.interface';
import { PostsService } from '@shared/services/posts.service';

import {
  deletePost,
  deletePostFailure,
  deletePostSuccess,
  getPosts,
  getPostsFailure,
  getPostsSuccess,
} from './post.actions';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: ActionsSubject,
    private postsService: PostsService,
    private messageService: MessageService,
  ) {}

  posts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPosts),
      switchMap(({ pageOptions }) =>
        this.postsService.getAll(pageOptions).pipe(
          map((page: Page<Post>) => getPostsSuccess({ postsPage: page })),
          catchError((error) => of(getPostsFailure({ error }))),
        ),
      ),
    ),
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePost),
      mergeMap(({ id }) =>
        this.postsService.delete(id).pipe(
          map((post: Post) => deletePostSuccess({ post })),
          catchError((error) => of(deletePostFailure({ error }))),
        ),
      ),
      tap(() => {
        this.messageService.add({
          severity: 'success',
          detail: 'Новину видалено',
        });
      }),
    ),
  );
}
