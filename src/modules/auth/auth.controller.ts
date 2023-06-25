import { Body, Controller, Post } from '@nestjs/common';

import { AuthAdminSignUpDto } from '@dtos/auth-admin-sign-up.dto';
import { AuthSignInDto } from '@dtos/auth-sign-in.dto';
import { AuthSignUpDto } from '@dtos/auth-sign-up.dto';
import { ResetPasswordDto } from '@dtos/reset-password.dto';

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

  @Post('admin/sign-up')
  async adminSignUp(@Body() authAdminSignUpDto: AuthAdminSignUpDto) {
    return this.authService.adminSignUp(authAdminSignUpDto);
  }

  @Post('confirm-email')
  async confirmEmail(@Body() tokenObj: { confirmEmailToken: string }) {
    const { confirmEmailToken } = tokenObj;
    return this.authService.confirmEmail(confirmEmailToken);
  }

  @Post('reset-password')
  async resetPassword(@Body() confirmPassword: ResetPasswordDto) {
    return this.authService.resetPassword(confirmPassword);
  }

  @Post('forgot-password')
  async sendResetPasswordMail(@Body() emailObj: { email: string }) {
    return this.authService.forgotPassword(emailObj.email);
  }

  @Post('send-email-confirmation')
  async sendEmailConfirmation(@Body() emailObj: { email: string }) {
    return this.authService.sendEmailConfirmation(emailObj.email);
  }
}
