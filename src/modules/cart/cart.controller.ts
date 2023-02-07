import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { AddToCartDto } from '@dtos/add-to-cart.dto';
import { RemoveFromCartDto } from '@dtos/remove-from-cart.dto';
import { CartEntity } from '@entities/cart.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { CartService } from './services/cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CartEntity))
  async getCart(@User('id') userId: number): Promise<CartEntity> {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.AddTo, CartEntity))
  async addToCart(
    @User('id') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartEntity> {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Post('remove')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.RemoveFrom, CartEntity),
  )
  async removeFromCart(
    @User('id') userId: number,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ): Promise<CartEntity> {
    return this.cartService.removeFromCart(userId, removeFromCartDto);
  }
}
