import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { CreateUserDto } from '@dtos/create-user.dto';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(
    queryRunner: QueryRunner,
    createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    try {
      const user = await queryRunner.manager.create(UserEntity, createUserDto);
      await queryRunner.manager.save(user);
      return this.sanitizeUser(user);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async update(user: UserEntity): Promise<UserEntity> {
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
    return await this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async getAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Object is possibly 'undefined'.
    delete user.password;
    return user;
  }
}
