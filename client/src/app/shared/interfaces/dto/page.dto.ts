import { PageMetaDto } from './page-meta.dto';

export interface PageDto<T> {
  readonly data: T;

  readonly meta: PageMetaDto;
}