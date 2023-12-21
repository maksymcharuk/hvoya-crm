import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  body: string;

  @IsBoolean()
  @IsOptional()
  isPublished: boolean;
}
