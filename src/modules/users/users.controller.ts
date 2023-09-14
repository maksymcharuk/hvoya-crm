import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { ConfirmUserDto } from '@dtos/confirm-user.dto';
import { OrdersPageOptionsDto } from '@dtos/orders-page-options.dto';
import { PaymentTransactionsPageOptionsDto } from '@dtos/payment-transactions-page-options.dto';
import { SendAdminInvitationDto } from '@dtos/send-admin-invitation.dto';
import { UpdateUserByAdminDto } from '@dtos/update-user-by-admin.dto';
import { UsersPageOptionsDto } from '@dtos/users-page-options.dto';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';

import { OrdersService } from '@modules/orders/services/orders.service';
import { PaymentTransactionsService } from '@modules/payment-transactions/services/payment-transactions.service';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { UsersService } from './services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly paymentTransactionsService: PaymentTransactionsService,
  ) {}

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserById(@Param('id') id: string) {
    return this.usersService.showById(id);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, UserEntity),
  )
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get(':id/orders')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserOrders(
    @User('id') currentUserId: string,
    @Param('id') userId: string,
    @Query() ordersPageOptionsDto: OrdersPageOptionsDto,
  ) {
    return this.ordersService.getOrders(
      currentUserId,
      ordersPageOptionsDto,
      userId,
    );
  }

  @Get(':id/payment-transactions')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserPaymentTransactions(
    @User('id') currentUserId: string,
    @Param('id') userId: string,
    @Query()
    paymentTransactionsPageOptionsDto: PaymentTransactionsPageOptionsDto,
  ) {
    return this.paymentTransactionsService.getPaymentTransactions(
      currentUserId,
      paymentTransactionsPageOptionsDto,
      userId,
    );
  }

  @Get(':id/users')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserUsers(
    @User('id') currentUserId: string,
    @Param('id') userId: string,
    @Query()
    usersPageOptionsDto: UsersPageOptionsDto,
  ) {
    return this.usersService.getUsers(
      usersPageOptionsDto,
      currentUserId,
      userId,
    );
  }

  @Post(':id/update-by-admin')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async update(
    @User('id') currentUserId: string,
    @Param('id') userId: string,
    @Body() userUpdate: UpdateUserByAdminDto,
  ) {
    return this.usersService.update(
      { ...userUpdate, id: userId },
      currentUserId,
    );
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUsers(
    @User('id') userId: string,
    @Query() usersPageOptionsDto: UsersPageOptionsDto,
  ) {
    return this.usersService.getUsers(usersPageOptionsDto, userId);
  }

  @Post('confirm')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async confirmUser(
    @User('id') currentUserId: string,
    @Body() confirmUserDto: ConfirmUserDto,
  ) {
    return this.usersService.confirmUser(confirmUserDto, currentUserId);
  }

  @Post('freeze-toggle')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async freezeToggleUser(@Body('userId') userId: string) {
    return this.usersService.freezeToggleUser(userId);
  }

  @Post('send-admin-invitation')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, UserEntity),
  )
  async sendAdminInvitation(
    @Body() sendAdminInvitationDto: SendAdminInvitationDto,
  ) {
    return this.usersService.sendAdminInvitation(sendAdminInvitationDto);
  }
}
