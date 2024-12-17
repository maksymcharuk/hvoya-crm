import { PostState } from '../shared/state/posts/post.reducer';

export interface AppStore {
  posts: PostState;
}
