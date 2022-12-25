import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthLoginDto } from '../../dtos/auth-login.dto';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async test() {
    return 'Success!';
  }
}
