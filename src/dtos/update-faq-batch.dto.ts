import { IsString } from 'class-validator';

import { UpdateFaqDto } from './update-faq.dto';

export class UpdateFaqBatchDto extends UpdateFaqDto {
  @IsString()
  id: string;
}
