import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwTokenModule {}
