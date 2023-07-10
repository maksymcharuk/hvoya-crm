import { OrderReturnRequestItemEntity } from "@entities/order-return-request-item.entity";
import { DeliveryService } from "@enums/delivery-service.enum";

import { Transform } from "class-transformer";
import { IsAlphanumeric, IsEnum, IsNotEmpty } from "class-validator";

export class CreateReturnRequestDto {

  @IsNotEmpty({ message: 'Необхідно вказати причину повернення' })
  customerComment: string;

  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  trackingId: string;

  @IsEnum(DeliveryService)
  @IsNotEmpty({ message: 'Необхідно вказати службу доставки' })
  deliveryService: DeliveryService;

  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  requestedItems: OrderReturnRequestItemEntity[]
}
