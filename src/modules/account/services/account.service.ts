import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { ChangePasswordDto } from '@dtos/change-password.dto';
import { UpdateProfileDto } from '@dtos/update-profile.dto';
import { UserEntity } from '@entities/user.entity';

import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class AccountService {
  constructor(private usersService: UsersService) {}

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    let user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    if (!(await user.validatePassword(changePasswordDto.currentPassword))) {
      throw new HttpException('Поточний пароль неправильний', 400);
    }

    try {
      user = await this.usersService.update(
        {
          id: userId,
          password: changePasswordDto.password,
        },
        userId,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserEntity> {
    let user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    try {
      user = await this.usersService.update(
        {
          id: userId,
          ...updateProfileDto,
        },
        userId,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }

    return this.sanitizeUser(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Object is possibly 'undefined'.
    delete user.password;
    return user;
  }
}
