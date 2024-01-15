import { PostState } from '../modules/admin/modules/posts/state/post.reducer';

export interface AppStore {
  posts: PostState;
}
