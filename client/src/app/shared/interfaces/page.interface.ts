import { PageMeta } from './page-meta.interface';

export interface Page<T> {
  data: T[];
  readonly meta: PageMeta;
}
