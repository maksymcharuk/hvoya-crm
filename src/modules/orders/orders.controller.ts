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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { CreateOrderDto } from '@dtos/create-order.dto';
import { OrdersPageOptionsDto } from '@dtos/orders-page-options.dto';
import { UpdateOrderByCustomerDto } from '@dtos/update-order-by-customer.dto';
import { UpdateOrderDto } from '@dtos/update-order.dto';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderEntity } from '@entities/order.entity';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { OrdersService } from './services/orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('return-requests')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, OrderReturnRequestEntity),
  )
  async getOrdersForReturnRequest(
    @User('id') userId: string,
  ): Promise<string[]> {
    return this.ordersService.getOrderNumberListForReturnRequest(userId);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, OrderEntity))
  async getOrders(
    @User('id') userId: string,
    @Query() ordersPageOptionsDto: OrdersPageOptionsDto,
  ): Promise<Page<OrderEntity>> {
    return this.ordersService.getOrders(userId, ordersPageOptionsDto);
  }

  @Get(':number')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, OrderEntity))
  async getOrder(
    @User('id') userId: string,
    @Param('number') number: string,
  ): Promise<OrderEntity> {
    return this.ordersService.getOrder(userId, number);
  }

  @Put(':number')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.SuperUpdate, OrderEntity),
  )
  async updateOrder(
    @User('id') userId: string,
    @Param('number') orderNumber: string,
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
    return this.ordersService.updateOrder(
      orderNumber,
      userId,
      updateOrderDto,
      waybill,
    );
  }

  @Put(':number/update-by-customer')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, OrderEntity),
  )
  async updateOrderWaybill(
    @User('id') userId: string,
    @Param('number') orderNumber: string,
    @Body() updateOrderWaybillDto: UpdateOrderByCustomerDto,
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
    return this.ordersService.updateOrderByCustomer(
      userId,
      orderNumber,
      updateOrderWaybillDto,
      waybill,
    );
  }

  @Post(':number/cancel-by-customer')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, OrderEntity),
  )
  async cancelByCustomer(
    @User('id') userId: string,
    @Param('number') orderNumber: string,
  ): Promise<OrderEntity> {
    return this.ordersService.cancelByCustomer(userId, orderNumber);
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
