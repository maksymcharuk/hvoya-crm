import { createAction, props } from '@ngrx/store';

import { Post } from '@shared/interfaces/entities/post.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

export const addPost = createAction('[Post] Add Post', props<{ post: Post }>());
export const addPostSuccess = createAction(
  '[Post] Add Post Success',
  props<{ post: Post }>(),
);
export const addPostFailure = createAction(
  '[Post] Add Post Failure',
  props<{ error: any }>(),
);

export const getPosts = createAction(
  '[Post] Get Posts',
  props<{ pageOptions: PageOptions }>(),
);
export const getPostsSuccess = createAction(
  '[Post] Get Posts Success',
  props<{ postsPage: Page<Post> }>(),
);
export const getPostsFailure = createAction(
  '[Post] Get Posts Failure',
  props<{ error: any }>(),
);

export const deletePost = createAction(
  '[Post] Delete Post',
  props<{ id: string }>(),
);
export const deletePostSuccess = createAction(
  '[Post] Delete Post Success',
  props<{ post: Post }>(),
);
export const deletePostFailure = createAction(
  '[Post] Delete Post Failure',
  props<{ error: any }>(),
);
