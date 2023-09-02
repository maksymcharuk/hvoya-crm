import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { Role } from '@enums/role.enum';

import { PageOptionsDto } from './page-options.dto';

export class UsersPageOptionsDto extends PageOptionsDto {
  @IsOptional()
  readonly searchQuery?: string;

  @IsEnum(Role, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsOptional()
  readonly roles: Role[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  readonly managerIds?: string[];

  @IsOptional()
  readonly userConfirmed?: boolean;

  @IsOptional()
  readonly emailConfirmed?: boolean;

  @IsOptional()
  readonly userFreezed?: boolean;

  constructor(partial: Partial<UsersPageOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
