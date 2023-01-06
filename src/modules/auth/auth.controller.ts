import { Body, Controller, Post } from '@nestjs/common';

import { AuthSignInDto } from '@dtos/auth-sign-in.dto';
import { AuthSignUpDto } from '@dtos/auth-sign-up.dto';

import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() authSignInDto: AuthSignInDto) {
    return this.authService.signIn(authSignInDto);
  }

  @Post('sign-up')
  async signUp(@Body() authSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(authSignUpDto);
  }
}
