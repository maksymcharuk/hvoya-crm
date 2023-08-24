import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsOptional } from 'class-validator';

export class UpdateRequestByCustomerDto {
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  @IsOptional()
  trackingId?: string
}
