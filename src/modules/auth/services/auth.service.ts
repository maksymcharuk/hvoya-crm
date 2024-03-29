import { validate } from 'class-validator';
import { DataSource } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { AuthAdminSignUpDto } from '@dtos/auth-admin-sign-up.dto';
import { AuthSignInDto } from '@dtos/auth-sign-in.dto';
import { AuthSignUpDto } from '@dtos/auth-sign-up.dto';
import { ResetPasswordDto } from '@dtos/reset-password.dto';
import { SendAdminInvitationDto } from '@dtos/send-admin-invitation.dto';
import { UsersPageOptionsDto } from '@dtos/users-page-options.dto';
import { UserEntity } from '@entities/user.entity';
import { Env } from '@enums/env.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { Role } from '@enums/role.enum';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';

import { ConfirmEmailMail } from '@modules/mail/mails/confirm-email.mail';
import { ConfirmUserMail } from '@modules/mail/mails/confirm-user.mail';
import { ResetPasswordEmailMail } from '@modules/mail/mails/reset-password-email.mail';
import { MailService } from '@modules/mail/services/mail.service';
import { UsersService } from '@modules/users/services/users.service';

import config from '../../../config';

const { APP_ORIGIN } = config();

@Injectable()
export class AuthService {
  private readonly baseClientUrl = APP_ORIGIN.get(
    this.configService.get('NODE_ENV') || Env.Development,
  );

  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signIn(authSignInDto: AuthSignInDto) {
    const user = await this.validateUser(authSignInDto);

    if (user.emailConfirmed === false) {
      throw new ConflictException(
        'Будь ласка, підтвердіть вашу електронну пошту. Ми відправили вам лист з посиланням для підтвердження.',
      );
    } else if (user.userConfirmed === false) {
      throw new ForbiddenException(
        'Ваш акаунт ще не підтверджено. Зачекайте або зверніться до менеджера.',
      );
    } else if (user.userFreezed === true) {
      throw new HttpException(
        'Вибачте, ваш акаунт тимчасово призупинено. Зверніться до менеджера за більш детальною інформацією.',
        406,
      );
    }

    return this.signToken(user);
  }

  async signUp(authSignUpDto: AuthSignUpDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { email } = authSignUpDto;

    let user = await this.usersService.findByEmail(email);
    let adminUsers = await this.usersService.getUsers(
      new UsersPageOptionsDto({ roles: [Role.SuperAdmin] }),
    );
    if (user) {
      throw new HttpException(
        'Користувач з такою електронною поштою вже існує. Спробуйте іншу пошту.',
        HttpStatus.CONFLICT,
      );
    }
    if (adminUsers.data.length === 0) {
      throw new HttpException(
        'Немає адміністраторів. Створіть адміністратора',
        HttpStatus.CONFLICT,
      );
    }
    let adminEmails = adminUsers.data.map((user) => user.email);

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user = await this.usersService.create(authSignUpDto, queryRunner);

      const { access_token } = this.signToken(user);
      const url = `${APP_ORIGIN.get(
        this.configService.get('NODE_ENV') || Env.Development,
      )}/auth/confirm-email?token=${access_token}`;
      const userUrl = `${APP_ORIGIN.get(
        this.configService.get('NODE_ENV') || Env.Development,
      )}/admin/users/${user.id}`;

      await this.mailService.send(new ConfirmEmailMail(user, url), user.email);
      await this.mailService.send(
        new ConfirmUserMail(user, userUrl),
        adminEmails,
      );

      this.eventEmitter.emit(NotificationEvent.UserCreated, {
        data: user,
        type: NotificationType.UserCreated,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async adminSignUp(authAdminSignUpDto: AuthAdminSignUpDto) {
    try {
      await validate(authAdminSignUpDto);
    } catch (error) {
      throw new BadRequestException(error);
    }

    const decodedToken: SendAdminInvitationDto = this.jwtService.verify(
      authAdminSignUpDto.token,
    );

    if (!decodedToken) {
      throw new HttpException('Недійсний токен', HttpStatus.BAD_REQUEST);
    }

    const { email } = decodedToken;

    let user = await this.usersService.findByEmail(email);
    if (user) {
      throw new HttpException(
        'Користувач з такою електронною поштою вже існує. Спробуйте іншу пошту.',
        HttpStatus.CONFLICT,
      );
    }

    try {
      user = await this.usersService.create({
        ...authAdminSignUpDto,
        email: decodedToken.email,
        role: decodedToken.role,
        emailConfirmed: true,
        userConfirmed: true,
      });
    } catch (err) {
      throw new HttpException(err.message, 500);
    }

    this.eventEmitter.emit(NotificationEvent.UserCreated, {
      data: user,
      type: NotificationType.AdminCreated,
    });

    return this.signToken(user);
  }

  async confirmEmail(confirmEmailToken: string): Promise<void> {
    const decodedToken = this.jwtService.verify(
      confirmEmailToken,
    ) as JwtTokenPayload;

    if (!decodedToken) {
      throw new HttpException('Недійсний токен', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findById(decodedToken.user.id);
    if (!user) {
      throw new HttpException(
        'Користувача з таким токеном не знайдено',
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
        'Користувача з такою електронною поштою не знайдено',
        HttpStatus.NOT_FOUND,
      );
    }

    const { access_token } = this.signToken(user, { expiresIn: '10m' });
    const url = `${APP_ORIGIN.get(
      this.configService.get('NODE_ENV') || Env.Development,
    )}/auth/reset-password?token=${access_token}`;
    await this.mailService.send(
      new ResetPasswordEmailMail(user, url),
      user.email,
    );
  }

  async resetPassword(changePassword: ResetPasswordDto): Promise<void> {
    const { token, password } = changePassword;
    let decodedToken;

    try {
      decodedToken = this.jwtService.verify(token) as JwtTokenPayload;
    } catch (error) {
      throw new HttpException(
        'Посилання для зміни паролю недійсне або закінчився термін дії. Спробуйте подати запит на відновлення паролю ще раз.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.findById(decodedToken.user.id);
    if (!user) {
      throw new HttpException(
        'Користувача з таким токеном не знайдено',
        HttpStatus.NOT_FOUND,
      );
    }

    if (await user.validatePassword(password)) {
      throw new HttpException(
        'Новий пароль повинен відрізнятися від старого',
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
        'Користувача з такою електронною поштою не знайдено',
        HttpStatus.NOT_FOUND,
      );
    }

    const { access_token } = this.signToken(user);
    const url = `${this.baseClientUrl}/auth/confirm-email?token=${access_token}`;
    await this.mailService.send(new ConfirmEmailMail(user, url), user.email);
  }

  async validateUser(authSignInDto: AuthSignInDto): Promise<UserEntity> {
    const { email, password } = authSignInDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException('Електронна пошта або пароль невірні');
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
