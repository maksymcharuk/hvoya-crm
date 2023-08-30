import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';

import { INestApplicationContext } from '@nestjs/common';

import { ProductPropertiesEntity } from '@entities/product-properties.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { DeliveryService } from '@enums/delivery-service.enum';

import { BalanceService } from '@modules/balance/services/balance.service';
import { CartService } from '@modules/cart/services/cart.service';
import { OrdersService } from '@modules/orders/services/orders.service';
import { ProductsService } from '@modules/products/services/products/products.service';
import { UsersService } from '@modules/users/services/users.service';

const NUMBER_OF_ORDERS = 1;

export class OrdersSeeder {
  app: INestApplicationContext;
  dataSource: DataSource;
  usersService: UsersService;
  productsService: ProductsService;
  cartService: CartService;
  ordersService: OrdersService;
  balanceService: BalanceService;

  constructor(app: INestApplicationContext) {
    this.app = app;
  }

  async run() {
    await this.setup();
    await this.seedOrders();
  }

  async setup() {
    this.dataSource = this.app.get(DataSource);
    this.usersService = this.app.get(UsersService);
    this.productsService = this.app.get(ProductsService);
    this.cartService = this.app.get(CartService);
    this.ordersService = this.app.get(OrdersService);
    this.balanceService = this.app.get(BalanceService);
  }

  async seedOrders() {
    const user = await this.usersService.findByEmail('test-user@email.com');

    if (!user) {
      throw new Error('User not found');
    }

    await this.balanceService.addFunds(user.id, 1000000);

    const products = await this.setupProducts(user.id);
    const numberOfOrders = NUMBER_OF_ORDERS;

    for (let i = 0; i < numberOfOrders; i++) {
      const numberOfProductsPerCart = this.getRandomInt(1, 3);
      await this.placeOrder(user.id, products, numberOfProductsPerCart);
    }
    console.log(`${numberOfOrders} orders created`);
  }

  async placeOrder(
    userId: string,
    products: ProductVariantEntity[],
    numberOfProductsPerCart: number,
  ) {
    for (let i = 0; i < numberOfProductsPerCart; i++) {
      try {
        const quantity = this.getRandomInt(1, 3);
        const randomProduct = this.getRandomProductVariant(products, quantity);
        await this.cartService.addToCart(userId, {
          productId: randomProduct.id,
          quantity: quantity,
        });
      } catch (error) {}
    }
    await this.ordersService.createOrder(userId, {
      trackingId: '1234567890',
      deliveryService: DeliveryService.NovaPoshta,
      customerNote: 'Нотатка до замовлення',
    });
  }

  getRandomProductVariant(
    products: ProductVariantEntity[],
    quantity: number,
  ): ProductVariantEntity {
    const filteredProducts = products.filter((p) => p.stock >= quantity);
    const randomIndex = this.getRandomInt(0, filteredProducts.length - 1);
    return filteredProducts[randomIndex]!;
  }

  async setupProducts(userId: string): Promise<ProductVariantEntity[]> {
    await this.updateProductsDependencies();
    const baseProducts = await this.productsService.getProducts(userId);
    return baseProducts.map((product) => product.variants).flat();
  }

  async updateProductsDependencies() {
    const products = await this.dataSource.manager.find(ProductVariantEntity);
    const properties = await this.dataSource.manager.find(
      ProductPropertiesEntity,
    );
    for (const product of products) {
      product.stock = 1000;
    }
    for (const property of properties) {
      property.price = new Decimal(this.getRandomInt(100, 1000));
    }
    await this.dataSource.manager.save(products);
    await this.dataSource.manager.save(properties);
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
