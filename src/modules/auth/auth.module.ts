import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { OneCModule } from '../integrations/one-c/one-c.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule, PassportModule, MailModule, OneCModule],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
