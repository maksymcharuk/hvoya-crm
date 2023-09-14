import { validate } from 'class-validator';
import {
  DataSource,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { ConfirmUserDto } from '@dtos/confirm-user.dto';
import { CreateUserDto } from '@dtos/create-user.dto';
import { SendAdminInvitationDto } from '@dtos/send-admin-invitation.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';
import { UsersPageOptionsDto } from '@dtos/users-page-options.dto';
import { BalanceEntity } from '@entities/balance.entity';
import { CartEntity } from '@entities/cart.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Env } from '@enums/env.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { SortOrder } from '@enums/sort-order.enum';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import {
  AppAbility,
  CaslAbilityFactory,
} from '@modules/casl/casl-ability/casl-ability.factory';
import { OneCApiClientService } from '@modules/integrations/one-c/one-c-client/services/one-c-api-client/one-c-api-client.service';
import { AdminInvitationMail } from '@modules/mail/mails/admin-invitation.mail';
import { MailService } from '@modules/mail/services/mail.service';

import config from '../../../config';

const { APP_ORIGIN } = config();
@Injectable()
export class UsersService {
  private readonly baseClientUrl = APP_ORIGIN.get(
    this.configService.get('NODE_ENV') || Env.Development,
  );

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly eventEmitter: EventEmitter2,
    private readonly oneCApiClientService: OneCApiClientService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    queryRunner?: QueryRunner,
  ): Promise<UserEntity> {
    const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
    try {
      let user = await manager.create<UserEntity>(UserEntity, createUserDto);
      user.balance = await manager.save(BalanceEntity, new BalanceEntity());
      await manager.save(user);
      await this.oneCApiClientService.counterparty(user);
      return user;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  update(
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<UserEntity>;
  update(updateUserDto: UpdateUserDto): Promise<void>;

  async update(
    updateUserDto: UpdateUserDto,
    currentUserId?: string,
  ): Promise<UserEntity | void> {
    const queryRunner = this.dataSource.createQueryRunner();
    let currentUser!: UserEntity;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await validate(updateUserDto);

      let user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: updateUserDto.id },
        relations: ['manager'],
      });

      if (currentUserId) {
        currentUser = await queryRunner.manager.findOneOrFail(UserEntity, {
          where: { id: currentUserId },
        });

        const ability = this.caslAbilityFactory.createForUser(currentUser);

        if (ability.cannot(Action.Update, user)) {
          throw new HttpException(
            'Ви не можете редагувати цього користувача',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      await queryRunner.manager.save(UserEntity, { ...user, ...updateUserDto });
      await this.oneCApiClientService.counterparty({
        ...user,
        ...updateUserDto,
      });

      await queryRunner.commitTransaction();

      if (currentUser) {
        return this.dataSource.manager.findOneOrFail(UserEntity, {
          where: { id: updateUserDto.id },
          relations: ['manager'],
        });
      }
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
    return this.usersRepository.findOneOrFail({
      where: { id },
      relations: ['balance'],
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByAccountNumber(accountNumber: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ accountNumber });
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
    currentUserId?: string,
    userId?: string,
  ): Promise<Page<UserEntity>> {
    const manager = this.dataSource.createEntityManager();
    let user: UserEntity | null = null;
    let ability: AppAbility | null = null;

    if (currentUserId) {
      user = await manager.findOneOrFail(UserEntity, {
        where: { id: currentUserId },
      });
      ability = this.caslAbilityFactory.createForUser(user);
    }

    const queryBuilder = this.getUserQuery();

    if (userId) {
      queryBuilder.andWhere('manager.id = :userId', {
        userId,
      });
    }

    if (pageOptionsDto.managerIds && pageOptionsDto.managerIds.length > 0) {
      queryBuilder.andWhere('manager.id IN (:...managerIds)', {
        managerIds: pageOptionsDto.managerIds,
      });
    }

    if (pageOptionsDto.roles && pageOptionsDto.roles.length > 0) {
      queryBuilder.andWhere('user.role IN (:...roles)', {
        roles: pageOptionsDto.roles,
      });
    }

    if (pageOptionsDto.searchQuery) {
      queryBuilder.andWhere(
        'LOWER(user.accountNumber) LIKE LOWER(:searchQuery) OR LOWER(user.firstName) LIKE LOWER(:searchQuery) OR LOWER(user.lastName) LIKE LOWER(:searchQuery)',
        {
          searchQuery: `%${pageOptionsDto.searchQuery}%`,
        },
      );
    }

    if (pageOptionsDto.userConfirmed !== undefined) {
      queryBuilder.andWhere('user.userConfirmed = :userConfirmed', {
        userConfirmed: pageOptionsDto.userConfirmed,
      });
    }

    if (pageOptionsDto.emailConfirmed !== undefined) {
      queryBuilder.andWhere('user.emailConfirmed = :emailConfirmed', {
        emailConfirmed: pageOptionsDto.emailConfirmed,
      });
    }

    if (pageOptionsDto.userFreezed !== undefined) {
      queryBuilder.andWhere('user.userFreezed = :userFreezed', {
        userFreezed: pageOptionsDto.userFreezed,
      });
    }

    if (pageOptionsDto.orderBy) {
      queryBuilder.orderBy(
        `user.${pageOptionsDto.orderBy}`,
        pageOptionsDto.order,
      );
    } else {
      queryBuilder.orderBy(`user.createdAt`, SortOrder.DESC);
    }

    if (pageOptionsDto.take !== 0) {
      queryBuilder.take(pageOptionsDto.take);
    }

    queryBuilder.skip(pageOptionsDto.skip);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    let users: UserEntity[] = entities;

    if (ability) {
      users = entities.map((user) => sanitizeEntity(ability!, user));
    }

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(users, pageMetaDto);
  }

  async confirmUser(
    confirmUserDto: ConfirmUserDto,
    currentUserId: string,
  ): Promise<UserEntity> {
    const manager = this.dataSource.manager;

    let user = await manager.findOneOrFail(UserEntity, {
      where: { id: confirmUserDto.userId },
      relations: ['manager'],
    });
    let currentUser = await manager.findOneOrFail(UserEntity, {
      where: { id: currentUserId },
    });

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (ability.cannot(Action.Confirm, user)) {
      throw new HttpException(
        'На жаль, ви не маєте прав на здійснення цієї операції',
        HttpStatus.FORBIDDEN,
      );
    }

    user = await this.update(
      {
        id: confirmUserDto.userId,
        userConfirmed: true,
        manager: { id: confirmUserDto.managerId },
      },
      currentUserId,
    );

    this.eventEmitter.emit(NotificationEvent.UserConfirmed, {
      data: user,
      type: NotificationType.UserConfirmed,
    });

    return user;
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

  async sendAdminInvitation(sendAdminInvitationDto: SendAdminInvitationDto) {
    try {
      await validate(sendAdminInvitationDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }

    const user = await this.findByEmail(sendAdminInvitationDto.email);
    if (user) {
      throw new HttpException(
        'Користувач з такою електронною поштою вже існує',
        HttpStatus.CONFLICT,
      );
    }

    const token = this.jwtService.sign(
      {
        email: sendAdminInvitationDto.email,
        role: sendAdminInvitationDto.role,
      },
      { expiresIn: '2d' },
    );
    const url = `${this.baseClientUrl}/auth/admin/sign-up?token=${token}`;
    await this.mailService.send(
      new AdminInvitationMail(sendAdminInvitationDto.role, url),
      sendAdminInvitationDto.email,
    );
  }

  async delete(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { id },
        relations: ['orders', 'cart', 'balance'],
      });

      if (!user) {
        throw new HttpException('Користувача нe знайдено', 404);
      }

      const paymentTransactionsNumber = await queryRunner.manager.count(
        PaymentTransactionEntity,
        {
          where: { balance: { id: user.balance.id } },
        },
      );

      const hasOrders = user.orders.length > 0;
      const hasTransactions = paymentTransactionsNumber > 0;

      switch (true) {
        case hasOrders:
          throw new BadRequestException(
            'Користувач має замовлення, видалення неможливе',
          );
        case hasTransactions:
          throw new BadRequestException(
            'Користувач має транзакції, видалення неможливе',
          );
      }

      await queryRunner.manager.remove(UserEntity, user);
      await queryRunner.manager.remove(BalanceEntity, user.balance);

      if (user.cart) {
        await queryRunner.manager.remove(CartEntity, user.cart);
      }

      this.eventEmitter.emit(NotificationEvent.UserDeleted, {
        data: user,
        type: NotificationType.UserDeleted,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message || err.response.message, err.status);
    } finally {
      await queryRunner.release();
    }
  }

  private getUserQuery(id?: string): SelectQueryBuilder<UserEntity> {
    const query = this.dataSource.createQueryBuilder(UserEntity, 'user');

    if (id) {
      query.where('user.id = :id', { id });
    }

    query.leftJoinAndSelect('user.manager', 'manager');

    return query;
  }
}
