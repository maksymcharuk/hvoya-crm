import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';
import { CartEntity } from '@entities/cart.entity';
import { CartItemEntity } from '@entities/cart-item.entity';

import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CartEntity, CartItemEntity]),
    CaslModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
