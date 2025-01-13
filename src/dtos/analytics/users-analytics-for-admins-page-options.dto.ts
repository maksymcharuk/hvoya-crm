import { Transform } from 'class-transformer';
import { IsOptional, ValidateIf } from 'class-validator';

import { PageOptionsDto } from '../page-options.dto';

export class UsersAnalyticsForAdminsPageOptionsDto extends PageOptionsDto {
  @IsOptional()
  readonly dateRangeType: 'all' | 'year' | 'custom' = 'all';

  @IsOptional()
  @ValidateIf((object) => object.dateRangeType === 'year')
  readonly year?: number;

  @IsOptional()
  @ValidateIf((object) => object.dateRangeType === 'custom')
  @Transform(({ value }: { value: [string, string] }) => {
    const [from, to] = value;
    return [new Date(from), new Date(to)];
  })
  readonly range?: [Date, Date];
}
