import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';

import { UpdateOrderOneCDTO } from '@interfaces/one-c/dtos/update-order.dto';

import { BasicAuthGuard } from '@modules/auth/basic-auth/basic-auth.guard';

import { OneCApiService } from '../services/one-c-api/one-c-api.service';

@Controller('one-c')
@UseGuards()
export class OneCController {
  constructor(private readonly oneCApiService: OneCApiService) {}

  @Put('orders/:orderId')
  @UseGuards(BasicAuthGuard)
  updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrderData: UpdateOrderOneCDTO,
  ): Promise<void> {
    return this.oneCApiService.updateOrder(orderId, updateOrderData);
  }
}
