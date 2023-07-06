import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { ChangePasswordDto } from '@dtos/change-password.dto';
import { UpdateProfileDto } from '@dtos/update-profile.dto';
import { UserEntity } from '@entities/user.entity';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async changePassword(
    currentUserId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    let user = await this.usersService.findById(currentUserId);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    if (!(await user.validatePassword(changePasswordDto.currentPassword))) {
      throw new HttpException('Поточний пароль неправильний', 400);
    }

    try {
      user = await this.usersService.update(
        {
          id: currentUserId,
          password: changePasswordDto.password,
        },
        currentUserId,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    return sanitizeEntity(ability, user);
  }

  async updateProfile(
    currentUserId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserEntity> {
    let user = await this.usersService.findById(currentUserId);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    try {
      user = await this.usersService.update(
        {
          id: currentUserId,
          ...updateProfileDto,
        },
        currentUserId,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    return sanitizeEntity(ability, user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    return sanitizeEntity(ability, user);
  }
}
