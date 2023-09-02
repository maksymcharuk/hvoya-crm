import { IsOptional } from 'class-validator';

import { PageOptionsDto } from './page-options.dto';

export class ProductsPageOptionsDto extends PageOptionsDto {
  @IsOptional()
  readonly height?: string;

  @IsOptional()
  readonly diameter?: string;

  @IsOptional()
  readonly color?: string;

  @IsOptional()
  readonly category?: string;

  @IsOptional()
  readonly inStockOnly?: boolean;

  @IsOptional()
  readonly searchQuery?: string;
}
