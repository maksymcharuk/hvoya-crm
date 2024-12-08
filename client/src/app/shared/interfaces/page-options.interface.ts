import { FilterMetadata } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

import { SortOrder } from '@shared/enums/sort-order.enum';

export class PageOptions {
  order?: SortOrder;
  orderBy?: string | string[] | null;
  searchQuery: string | string[] | null;
  filters: Record<string, string>;
  take?: string;
  skip?: string;
  page?: string;

  constructor(data: TableLazyLoadEvent & { page?: string }) {
    this.order = data.sortOrder === 1 ? SortOrder.ASC : SortOrder.DESC;
    this.orderBy = data.sortField;
    this.searchQuery = data.globalFilter || null;
    this.filters = data.filters ? this.getFilters(data.filters) : {};
    this.take = data.rows !== undefined ? String(data.rows) : undefined;
    this.skip = data.first !== undefined ? String(data.first) : undefined;
    this.page = data.page;
  }

  toParams(): Record<string, string | string[]> {
    const result: Record<string, string | string[]> = {};
    if (this.order) {
      result['order'] = this.order;
    }
    if (this.orderBy) {
      result['orderBy'] = this.orderBy;
    }
    if (this.searchQuery) {
      result['searchQuery'] = this.searchQuery;
    }
    if (this.take) {
      result['take'] = this.take;
    }
    if (this.skip) {
      result['skip'] = this.skip;
    }
    if (this.page) {
      result['page'] = this.page;
    }
    Object.keys(this.filters).forEach((key) => {
      result[key] = this.filters[key]!;
    });
    return result;
  }

  private getFilters(filters: {
    [s: string]: FilterMetadata | FilterMetadata[] | undefined;
  }): Record<string, string> {
    const result: Record<string, string> = {};
    Object.keys(filters).forEach((key) => {
      const filter = filters[key]!;
      if (Array.isArray(filter)) {
        filter.forEach((f) => {
          if (f.value !== null && f.value !== undefined) {
            result[key] = f.value;
          }
        });
      } else {
        if (filter.value !== null && filter.value !== undefined) {
          result[key] = filter.value;
        }
      }
    });
    return result;
  }
}
