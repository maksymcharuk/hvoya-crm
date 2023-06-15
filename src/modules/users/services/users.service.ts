import { DataSource, QueryRunner, Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from '@dtos/create-user.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';
import { BalanceEntity } from '@entities/balance.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { Role } from '@enums/role.enum';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { OneCApiService } from '@modules/integrations/one-c/services/one-c-api/one-c-api.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private caslAbilityFactory: CaslAbilityFactory,
    private eventEmitter: EventEmitter2,
    private readonly oneCApiService: OneCApiService,
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
      await this.oneCApiService.counterparty(user);
      return user;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user = await this.findById(updateUserDto.id);

      if (!user) {
        throw new NotFoundException('Користувача нe знайдено');
      }

      await queryRunner.manager.save(UserEntity, { ...user, ...updateUserDto });
      await this.oneCApiService.counterparty({ ...user, ...updateUserDto });

      await queryRunner.commitTransaction();
      return this.usersRepository.findOneByOrFail({ id: updateUserDto.id });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message || err.response.message, err.status);
    } finally {
      await queryRunner.release();
    }
  }

  showById(id: string): Promise<UserEntity | null> {
    return this.findById(id);
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByIdFull(
    id: string,
    currentUserId: string,
  ): Promise<UserEntity | null> {
    const currentUser = await this.usersRepository.findOneOrFail({
      where: { id: currentUserId },
    });
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    const user = await this.usersRepository.findOneOrFail({
      where: { id },
      relations: [
        'balance',
        'balance.paymentTransactions.order',
        'orders.items',
        'orders.items.productProperties.images',
      ],
      order: {
        balance: {
          paymentTransactions: {
            createdAt: 'DESC',
          },
        },
        orders: {
          createdAt: 'DESC',
        },
      },
    });

    if (!ability.can(Action.Read, user)) {
      throw new HttpException(
        'Ви не маєте прав для перегляду даних цього користувача',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
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
      message: `Акаунт підтвердженно`,
      data: user,
      type: NotificationType.User,
    });

    return this.usersRepository.save({ ...user, userConfirmed: true });
  }

  async freezeToggleUser(userId: string): Promise<UserEntity> {
    let user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('Користувача нe знайдено', 404);
    }

    return this.usersRepository.save({
      ...user,
      userFreezed: !user.userFreezed,
    });
  }
}
