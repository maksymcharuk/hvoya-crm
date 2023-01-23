import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@entities/user.entity';
import { ChangePasswordDto } from '@dtos/change-password.dto';
import { UpdateProfileDto } from '@dtos/update-profile.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserEntity> {
    let user = await this.usersRepository.findOneByOrFail({ id: userId });

    if (!(await user.validatePassword(changePasswordDto.previousPassword))) {
      throw new HttpException('Previous password is incorrect', 400);
    }

    try {
      user = await this.usersRepository.save({
        ...user,
        password: changePasswordDto.password,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserEntity> {
    let user = await this.usersRepository.findOneByOrFail({ id: userId });

    try {
      user = await this.usersRepository.save({
        ...user,
        ...updateProfileDto,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }

    return this.sanitizeUser(user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneByOrFail({ id });

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Object is possibly 'undefined'.
    delete user.password;
    return user;
  }
}
