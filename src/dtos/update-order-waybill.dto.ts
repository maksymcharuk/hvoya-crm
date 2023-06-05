import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class UpdateOrderWaybillDto {
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  trackingId?: string;
}
