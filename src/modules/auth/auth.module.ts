import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';
import { MailModule } from '@modules/mail/mail.module';
import { UsersModule } from '@modules/users/users.module';

import { AuthController } from './auth.controller';
import { BasicStrategy } from './basic-auth/basic.strategy';
import { JwtStrategy } from './jwt-auth/jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, PassportModule, MailModule, OneCClientModule],
  providers: [JwtStrategy, BasicStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
