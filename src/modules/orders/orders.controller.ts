import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { CreateOrderDto } from '@dtos/create-order.dto';
import { UpdateOrderWaybillDto } from '@dtos/update-order-waybill.dto';
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
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<OrderEntity> {
    return this.ordersService.getOrder(userId, id);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, OrderEntity))
  async getOrders(@User('id') userId: string): Promise<OrderEntity[]> {
    return this.ordersService.getOrders(userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.SuperUpdate, OrderEntity),
  )
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf)$' }),
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
    @User('id') userId: string,
    @Param('id') orderId: string,
    @Body() updateOrderWaybillDto: UpdateOrderWaybillDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    waybill: Express.Multer.File,
  ): Promise<OrderEntity> {
    return this.ordersService.updateOrderWaybill(
      userId,
      orderId,
      updateOrderWaybillDto,
      waybill,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, OrderEntity),
  )
  async createOrder(
    @User('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    waybill?: Express.Multer.File,
  ): Promise<OrderEntity> {
    return this.ordersService.createOrder(userId, createOrderDto, waybill);
  }
}
