import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { SortOrder } from '@enums/sort-order.enum';

export class PageOptionsDto {
  @IsEnum(SortOrder)
  @IsOptional()
  readonly order?: SortOrder = SortOrder.DESC;

  @IsOptional()
  readonly orderBy: string = 'createdAt';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly take?: number = 9;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  set skip(value: number) {
    this.skipInternal = value;
  }

  get skip(): number {
    if (this.skipInternal !== undefined) {
      return this.skipInternal;
    }
    return (this.page! - 1) * this.take!;
  }

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  private skipInternal?: number;

  constructor(partial: Partial<PageOptionsDto>) {
    Object.assign(this, partial);
  }
}
