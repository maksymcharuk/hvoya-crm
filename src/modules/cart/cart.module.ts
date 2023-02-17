import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemEntity } from '@entities/cart-item.entity';
import { CartEntity } from '@entities/cart.entity';
import { UserEntity } from '@entities/user.entity';

import { CaslModule } from '../casl/casl.module';
import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CartEntity, CartItemEntity]),
    CaslModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
