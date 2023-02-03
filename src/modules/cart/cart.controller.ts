import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { AddToCartDto } from '@dtos/add-to-cart.dto';
import { CartEntity } from '@entities/cart.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './services/cart.service';
import { RemoveFromCartDto } from '@dtos/remove-from-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@User('id') userId: number): Promise<CartEntity> {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(
    @User('id') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartEntity> {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Post('remove')
  async removeFromCart(
    @User('id') userId: number,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ): Promise<CartEntity> {
    return this.cartService.removeFromCart(userId, removeFromCartDto);
  }
}
