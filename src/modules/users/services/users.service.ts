import { DataSource, QueryRunner, Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from '@dtos/create-user.dto';
import { BalanceEntity } from '@entities/balance.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { Role } from '@enums/role.enum';

import { CaslAbilityFactory } from '../../../modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private caslAbilityFactory: CaslAbilityFactory,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    queryRunner: QueryRunner,
    createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    try {
      let user = await queryRunner.manager.create<UserEntity>(
        UserEntity,
        createUserDto,
      );
      user.balance = await queryRunner.manager.save(
        BalanceEntity,
        new BalanceEntity(),
      );
      await queryRunner.manager.save(user);
      return user;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }

  showById(id: string): Promise<UserEntity | null> {
    return this.findById(id);
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async getAll(userId: string): Promise<UserEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.can(Action.SuperRead, UserEntity)) {
      return this.usersRepository.find();
    } else {
      return this.usersRepository.findBy({ role: Role.User });
    }
  }

  getAllSuperAdmins(): Promise<UserEntity[]> {
    return this.usersRepository.findBy({ role: Role.SuperAdmin });
  }

  async getAllAdmins(): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      where: [{ role: Role.SuperAdmin }, { role: Role.Admin }],
    });
  }

  async confirmUser(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });

    this.eventEmitter.emit(NotificationEvent.UserConfirmed, {
      message: `Акаунт користувача ${user.firstName} ${user.lastName} підтвердженно`,
      data: {
        id: user.id,
      },
      type: NotificationType.User,
    });

    return this.usersRepository.save({ ...user, userConfirmed: true });
  }

  async freezeToggleUser(userId: string): Promise<UserEntity> {
    let user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('Користувача не знайдено', 404);
    }

    return this.usersRepository.save({
      ...user,
      userFreezed: !user.userFreezed,
    });
  }
}
