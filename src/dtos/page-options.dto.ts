import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { SortOrder } from '@enums/sort-order.enum';

export class PageOptionsDto {
  @IsEnum(SortOrder)
  @IsOptional()
  readonly order?: SortOrder = SortOrder.ASC;

  @IsOptional()
  readonly orderBy: string = 'createdAt';

  @IsOptional()
  readonly size?: string;

  @IsOptional()
  readonly color?: string;

  @IsOptional()
  readonly category?: string;

  @IsOptional()
  readonly inStockOnly?: boolean;

  @IsOptional()
  readonly searchQuery?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly take?: number = 9;

  get skip(): number {
    return (this.page! - 1) * this.take!;
  }
}
