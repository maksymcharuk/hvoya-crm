export interface PageMeta {
  itemCount: number;
  pageCount: number;
  page: number;
  take: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}
