import { IsNotEmpty, IsString } from 'class-validator';

export class BaseRelationDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
