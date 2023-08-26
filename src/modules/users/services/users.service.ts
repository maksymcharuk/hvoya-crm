import { validate } from 'class-validator';
import { DataSource, QueryRunner, Repository } from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { ConfirmUserDto } from '@dtos/confirm-user.dto';
import { CreateUserDto } from '@dtos/create-user.dto';
import { SendAdminInvitationDto } from '@dtos/send-admin-invitation.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';
import { BalanceEntity } from '@entities/balance.entity';
import { CartEntity } from '@entities/cart.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Env } from '@enums/env.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { Role } from '@enums/role.enum';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
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
    return this.usersRepository.findOneBy({ id });
  }

  async findByIdFull(
    id: string,
    currentUserId: string,
  ): Promise<UserEntity | null> {
    const currentUser = await this.usersRepository.findOne({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      throw new NotFoundException('Користувача нe знайдено');
    }

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    const user = await this.usersRepository.findOneOrFail({
      where: { id },
      relations: [
        'balance.paymentTransactions.order',
        'orders.items.productProperties.images',
        'orders.statuses',
        'orders.delivery',
        'manager',
        'managedUsers',
      ],
      order: {
        balance: {
          paymentTransactions: {
            createdAt: 'DESC',
          },
        },
        orders: {
          createdAt: 'DESC',
          statuses: {
            createdAt: 'DESC',
          },
        },
      },
    });

    if (!ability.can(Action.Read, user)) {
      throw new HttpException(
        'Ви не маєте прав для перегляду даних цього користувача',
        HttpStatus.FORBIDDEN,
      );
    }

    return sanitizeEntity(ability, user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByAccountNumber(accountNumber: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ accountNumber });
  }

  async getAll(userId: string): Promise<UserEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);
    const users = await manager.find(UserEntity, {
      relations: ['manager'],
    });

    return users
      .filter((user) => ability.can(Action.Read, user))
      .map((user) => sanitizeEntity(ability, user));
  }

  getAllSuperAdmins(): Promise<UserEntity[]> {
    return this.usersRepository.findBy({ role: Role.SuperAdmin });
  }

  async getAllAdmins(currentUserId?: string): Promise<UserEntity[]> {
    const admins = await this.usersRepository.find({
      where: [{ role: Role.SuperAdmin }, { role: Role.Admin }],
    });

    if (currentUserId) {
      let currentUser = await this.dataSource.manager.findOneOrFail(
        UserEntity,
        {
          where: { id: currentUserId },
        },
      );

      const ability = this.caslAbilityFactory.createForUser(currentUser);

      return admins.filter((admin) => ability.can(Action.Read, admin));
    }

    return admins;
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
        relations: ['orders', 'balance.paymentTransactions', 'cart'],
      });

      if (!user) {
        throw new HttpException('Користувача нe знайдено', 404);
      }

      const hasOrders = user.orders.length > 0;
      const hasTransactions = user.balance.paymentTransactions.length > 0;

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
}
