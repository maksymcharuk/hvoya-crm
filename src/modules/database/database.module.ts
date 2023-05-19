import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderSubscriber } from './subscribers/order.subscriber';
import { ProductSizeSubscriber } from './subscribers/product-size.subscriber';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        subscribers: [UserSubscriber, ProductSizeSubscriber, OrderSubscriber],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
