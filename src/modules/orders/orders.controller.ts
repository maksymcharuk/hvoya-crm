import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { CreateOrderDto } from '@dtos/create-order.dto';
import { UpdateOrderDto } from '@dtos/update-order.dto';
import { OrderEntity } from '@entities/order.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { OrdersService } from './services/orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, OrderEntity))
  async getOrder(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderEntity> {
    return this.ordersService.getOrder(userId, id);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, OrderEntity))
  async getOrders(@User('id') userId: number): Promise<OrderEntity[]> {
    return this.ordersService.getOrders(userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.SuperUpdate, OrderEntity),
  )
  async updateOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf|jpg|png)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    return this.ordersService.updateOrder(orderId, updateOrderDto, waybill);
  }

  @Put(':id/update-waybill')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, OrderEntity),
  )
  async updateOrderWaybill(
    @User('id') userId: number,
    @Param('id') orderId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf|jpg|png)$' }),
        ],
      }),
    )
    waybill: Express.Multer.File,
  ): Promise<OrderEntity> {
    return this.ordersService.updateOrderWaybill(userId, orderId, waybill);
  }

  @Post()
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, OrderEntity),
  )
  async createOrder(
    @User('id') userId: number,
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf|jpg|png)$' }),
        ],
      }),
    )
    waybill: Express.Multer.File,
  ): Promise<OrderEntity> {
    return this.ordersService.createOrder(userId, createOrderDto, waybill);
  }
}
