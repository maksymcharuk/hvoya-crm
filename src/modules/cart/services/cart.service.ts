import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';

import { AddToCartDto } from '@dtos/add-to-cart.dto';
import { RemoveFromCartDto } from '@dtos/remove-from-cart.dto';
import { CartItemEntity } from '@entities/cart-item.entity';
import { CartEntity } from '@entities/cart.entity';

@Injectable()
export class CartService {
  constructor(private dataSource: DataSource) {}

  async getCart(userId: number): Promise<CartEntity> {
    const manager = this.dataSource.createEntityManager();

    try {
      let cart = await manager.findOne(CartEntity, {
        where: { owner: { id: userId } },
        relations: ['items.product.images'],
        order: {
          items: {
            product: {
              id: 'ASC',
            },
          },
        },
      });
      if (!cart) {
        cart = await manager.save(CartEntity, {
          owner: { id: userId },
          items: [],
        });
      }
      return cart;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ): Promise<CartEntity> {
    const manager = this.dataSource.createEntityManager();
    let cart = await this.getCart(userId);

    let cartItem = await manager.findOne(CartItemEntity, {
      where: {
        cart: { id: cart.id },
        product: { id: addToCartDto.productId },
      },
      relations: ['product'],
    });

    if (cartItem) {
      cartItem.quantity = addToCartDto.quantity;
      await manager.save(cartItem);
    } else {
      cartItem = await manager.save(CartItemEntity, {
        product: { id: addToCartDto.productId },
        quantity: addToCartDto.quantity,
      });
      cart.items.push(cartItem);
      await manager.save(cart);
    }

    cart = await this.getCart(userId);
    cart.total = this.calculateTotal(cart);
    await manager.save(cart);

    return this.getCart(userId);
  }

  async removeFromCart(
    userId: number,
    removeFromCartDto: RemoveFromCartDto,
  ): Promise<CartEntity> {
    const manager = this.dataSource.createEntityManager();
    let cart = await this.getCart(userId);

    const cartItem = await manager.findOne(CartItemEntity, {
      where: {
        cart: { id: cart.id },
        product: { id: removeFromCartDto.productId },
      },
    });

    if (cartItem) {
      await manager.remove(cartItem);

      cart = await this.getCart(userId);
      cart.total = this.calculateTotal(cart);

      await manager.save(cart);
    }

    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<CartEntity> {
    const manager = this.dataSource.createEntityManager();
    const cart = await this.getCart(userId);

    cart.items = [];
    cart.total = new Decimal(0);

    await manager.save(cart);

    return this.getCart(userId);
  }

  private calculateTotal(cart: CartEntity): Decimal {
    return cart.items.reduce(
      (total, item) => total.add(item.product.price.times(item.quantity)),
      new Decimal(0),
    );
  }
}
