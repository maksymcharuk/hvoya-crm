import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../../../dtos/create-user.dto';
import { UserEntity } from '../../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return this.sanitizeUser(user);
  }

  async showById(id: number): Promise<UserEntity> {
    const user = await this.findById(id);

    return this.sanitizeUser(user);
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({ email });
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    delete user.password;
    return user;
  }
}
