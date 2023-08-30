import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@root/app.module';
import config from '@root/config';

import { OrdersSeeder } from './seeders/orders.seeder';

const { isDevelopment } = config();

enum Type {
  Orders = 'orders',
}

class Seed {
  app: INestApplicationContext;

  async run() {
    console.log('Running custom script...');
    const seedType = process.env['npm_config_seed_type'];

    if (!seedType || ![Type.Orders].includes(seedType as Type)) {
      console.error("No type provided. Can be: 'orders'");
      return;
    }

    await this.setup();

    try {
      switch (seedType) {
        case Type.Orders:
          await new OrdersSeeder(this.app).run();
          break;
        default:
          console.error('No script found');
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      console.log('Closing...');
      await this.app.close();
    }
  }

  async setup() {
    console.log('Setting up...');
    this.app = await NestFactory.createApplicationContext(AppModule);
  }
}

if (isDevelopment()) {
  new Seed().run();
} else {
  console.error('Script is only available in development mode');
}
