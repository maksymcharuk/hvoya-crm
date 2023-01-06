import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthSignInDto } from '@dtos/auth-sign-in.dto';
import { AuthSignUpDto } from '@dtos/auth-sign-up.dto';
import { UserEntity } from '@entities/user.entity';
import { JwtTokenPayload } from '@interfaces/jwt-token-payload.interface';

import { UsersService } from '../../../modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(authSignInDto: AuthSignInDto) {
    const user = await this.validateUser(authSignInDto);

    return this.signToken(user);
  }

  async signUp(authSignUpDto: AuthSignUpDto) {
    const { email } = authSignUpDto;

    let user = await this.usersService.findByEmail(email);
    if (user) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.CONFLICT,
      );
    }

    user = await this.usersService.create(authSignUpDto);

    return this.signToken(user);
  }

  async validateUser(authSignInDto: AuthSignInDto): Promise<UserEntity> {
    const { email, password } = authSignInDto;

    const user = await this.usersService.findByEmail(email);
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private signToken(user: UserEntity) {
    const payload: JwtTokenPayload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
