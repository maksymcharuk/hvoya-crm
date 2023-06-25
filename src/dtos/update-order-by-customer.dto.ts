import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderByCustomerDto {
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  trackingId?: string;

  @IsOptional()
  customerNote?: string;
}
