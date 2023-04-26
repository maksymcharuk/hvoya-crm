import { DataSource, QueryRunner, Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from '@dtos/create-user.dto';
import { UserEntity } from '@entities/user.entity';
import { Role } from '@enums/role.enum';
import { Action } from '@enums/action.enum';
import { BalanceEntity } from '@entities/balance.entity';

import { CaslAbilityFactory } from '../../../modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private caslAbilityFactory: CaslAbilityFactory,
  ) { }

  async create(
    queryRunner: QueryRunner,
    createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    try {
      let user = await queryRunner.manager.create(UserEntity, createUserDto);
      user.balance = await queryRunner.manager.save(BalanceEntity, new BalanceEntity());
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

  async getAll(userId: number): Promise<UserEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.can(Action.SuperRead, UserEntity)) {
      return await this.usersRepository.find();
    } else {
      return await this.usersRepository.findBy({ role: Role.User });
    }
  }

  async getAllSuperAdmins(): Promise<UserEntity[]> {
    return await this.usersRepository.findBy({ role: Role.SuperAdmin });
  }

  async getAllAdmins(): Promise<UserEntity[]> {
    return await this.usersRepository.find({ where: [{ role: Role.SuperAdmin }, { role: Role.Admin }] });
  }

  async confirmUser(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    return await this.usersRepository.save({ ...user, userConfirmed: true });
  }

  async freezeToggleUser(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    return await this.usersRepository.save({
      ...user,
      userFreezed: !user.userFreezed,
    });
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Object is possibly 'undefined'.
    delete user.password;
    return user;
  }
}
