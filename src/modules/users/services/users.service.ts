import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '@dtos/create-user.dto';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return this.sanitizeUser(user);
  }

  async showById(id: number): Promise<UserEntity | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Object is possibly 'undefined'.
    delete user.password;
    return user;
  }
}
