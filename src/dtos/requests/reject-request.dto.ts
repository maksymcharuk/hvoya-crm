import { IsOptional } from 'class-validator';

export class RejectRequestDto {
  @IsOptional()
  managerComment?: string;
}
