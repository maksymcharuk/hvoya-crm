import { DeliveryService } from "@enums/delivery-service.enum";

import { Transform } from "class-transformer";
import { IsAlphanumeric, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class OrderReturnRequestItemDto {
  @IsNotEmpty({ message: 'Необхідно вказати кількість' })
  quantity: number;

  @IsNotEmpty({ message: 'Необхідно вказати замовлення' })
  orderItemId: string;

  @IsOptional()
  approved: boolean;
}

export class CreateReturnRequestDto {

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
  requestedItems: OrderReturnRequestItemDto[]

  @IsNotEmpty({ message: 'Необхідно вказати номер замовлення' })
  orderNumber: string;

  @IsOptional()
  deduction: number;
}
