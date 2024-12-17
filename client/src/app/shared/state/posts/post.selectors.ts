import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PostState, postFeatureKey } from './post.reducer';

// feature selector
export const selectPostsState =
  createFeatureSelector<PostState>(postFeatureKey);

export const selectPostsPage = createSelector(
  selectPostsState,
  (state) => state.postsPage,
);
