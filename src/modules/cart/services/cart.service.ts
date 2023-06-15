import Decimal from 'decimal.js';
import { DataSource, EntityManager } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AddToCartDto } from '@dtos/add-to-cart.dto';
import { RemoveFromCartDto } from '@dtos/remove-from-cart.dto';
import { CartItemEntity } from '@entities/cart-item.entity';
import { CartEntity } from '@entities/cart.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';

@Injectable()
export class CartService {
  constructor(private dataSource: DataSource) {}

  async getCart(userId: string): Promise<CartEntity> {
    const manager = this.dataSource.createEntityManager();

    try {
      let cart = await manager.findOne(CartEntity, {
        where: { owner: { id: userId } },
        relations: ['items.product.properties', 'items.product.baseProduct'],
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
      cart.total = this.calculateTotal(cart);
      return cart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartEntity> {
    const manager = this.dataSource.createEntityManager();
    let cart = await this.getCart(userId);
    const product = await manager.findOne(ProductVariantEntity, {
      where: { id: addToCartDto.productId },
    });

    if (!product) {
      throw new HttpException('Товар не знайдено', HttpStatus.NOT_FOUND);
    }

    if (product.stock < addToCartDto.quantity) {
      throw new HttpException(
        {
          message:
            'На жаль, даного продукту вже немає в наявності в достатній кількості',
          cart,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

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
    userId: string,
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

  async clearCart(userId: string, manager: EntityManager): Promise<CartEntity> {
    const cart = await this.getCart(userId);

    cart.items = [];
    cart.total = new Decimal(0);

    await manager.save(cart);

    return this.getCart(userId);
  }

  private calculateTotal(cart: CartEntity): Decimal {
    return cart.items.reduce(
      (total, item) =>
        total.add(item.product.properties.price.times(item.quantity)),
      new Decimal(0),
    );
  }
}
