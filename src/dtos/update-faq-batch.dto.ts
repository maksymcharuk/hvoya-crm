import { IsNumber } from 'class-validator';

import { UpdateFaqDto } from './update-faq.dto';

export class UpdateFaqBatchDto extends UpdateFaqDto {
  @IsNumber()
  id: number;
}
