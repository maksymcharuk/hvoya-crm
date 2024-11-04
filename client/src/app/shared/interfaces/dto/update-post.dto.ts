import { CreatePostDTO } from './create-post.dto';

export interface UpdatePostDTO extends Partial<CreatePostDTO> {
  id: string;
}
