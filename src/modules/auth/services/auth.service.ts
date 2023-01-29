import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthSignInDto } from '@dtos/auth-sign-in.dto';
import { AuthSignUpDto } from '@dtos/auth-sign-up.dto';
import { UserEntity } from '@entities/user.entity';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';
import { Env } from '@enums/env.enum';

import { appOrigin } from '../../../config';
import { UsersService } from '../../../modules/users/services/users.service';
import { MailService } from '../../../modules/mail/services/mail.service';
import { ConfirmEmailMail } from '../../../modules/mail/mails/confirm-email.mail';
import { ResetPasswordEmailMail } from '../../../modules/mail/mails/reset-password-email.mail';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) { }

  async signIn(authSignInDto: AuthSignInDto) {
    const user = await this.validateUser(authSignInDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailConfirmed === false) {
      throw new ConflictException('Email is not confirmed');
    }

    return this.signToken(user);
  }

  async signUp(authSignUpDto: AuthSignUpDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { email } = authSignUpDto;

    let user = await this.usersService.findByEmail(email);
    if (user) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.CONFLICT,
      );
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user = await this.usersService.create(queryRunner, authSignUpDto);

      const { access_token } = this.signToken(user);
      const url = `${appOrigin.get(
        this.configService.get('NODE_ENV') || Env.Development,
      )}/auth/confirm-email?token=${access_token}`;
      await this.mailService.send(new ConfirmEmailMail(user, url), user.email);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async confirmEmail(confirmEmailToken: string) {
    const decodedToken = this.jwtService.verify(
      confirmEmailToken,
    ) as JwtTokenPayload;

    if (!decodedToken) {
      throw new HttpException('Invalid confirm token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findById(decodedToken.user.id);
    if (!user) {
      throw new HttpException(
        'User with such confirm token does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    user.emailConfirmed = true;

    await this.usersService.update(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        'User with such email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const { access_token } = this.signToken(user, { expiresIn: '10m' });
    const url = `${appOrigin.get(
      this.configService.get('NODE_ENV') || Env.Development,
    )}/auth/reset-password?token=${access_token}`;
    await this.mailService.send(
      new ResetPasswordEmailMail(user, url),
      user.email,
    );
  }

  async resetPassword(changePassword: { token: string; password: string }) {
    const { token, password } = changePassword;
    let decodedToken;

    try {
      decodedToken = this.jwtService.verify(token) as JwtTokenPayload;
    } catch (error) {
      throw new HttpException(
        'Link was expired, try to reset password again',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.findById(decodedToken.user.id);
    if (!user) {
      throw new HttpException(
        'User with such confirm token does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (await user.validatePassword(password)) {
      throw new HttpException(
        'New password should be different from old one',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = password;

    await this.usersService.update(user);
  }

  async sendEmailConfirmation(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        'User with such email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const { access_token } = this.signToken(user);
    const url = `${appOrigin.get(
      this.configService.get('NODE_ENV') || Env.Development,
    )}/auth/confirm-email?token=${access_token}`;
    await this.mailService.send(new ConfirmEmailMail(user, url), user.email);
  }

  async validateUser(authSignInDto: AuthSignInDto): Promise<UserEntity> {
    const { email, password } = authSignInDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException('User email or password is incorrect');
    }

    return user;
  }

  private signToken(user: UserEntity, options?: JwtSignOptions) {
    const payload: JwtTokenPayload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    return {
      access_token: this.jwtService.sign(payload, options),
    };
  }
}
