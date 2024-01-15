import { createFeature, createReducer, on } from '@ngrx/store';

import { Post } from '@shared/interfaces/entities/post.entity';
import { Page } from '@shared/interfaces/page.interface';

import {
  deletePost,
  deletePostSuccess,
  getPosts,
  getPostsFailure,
  getPostsSuccess,
} from './post.actions';

export const postFeatureKey = 'posts';
export interface PostState {
  postsPage: Page<Post> | null;
  loading: boolean;
  error: string;
}

export const initialState: PostState = {
  postsPage: null,
  loading: false,
  error: '',
};

export const postsFeature = createFeature({
  name: postFeatureKey,
  reducer: createReducer(
    initialState,
    on(getPosts, () => ({ ...initialState, loading: true })),
    on(getPostsSuccess, (state, { postsPage }) => ({
      ...state,
      postsPage,
      loading: false,
    })),
    on(getPostsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(deletePost, (state) => ({ ...state, loading: true })),
    on(deletePostSuccess, (state, { post }) => ({
      ...state,
      posts: state.postsPage?.data.filter((p) => p.id !== post.id),
      loading: false,
    })),
    on(getPostsFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
  ),
});
