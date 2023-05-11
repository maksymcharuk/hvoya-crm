import { DataSource } from 'typeorm';

import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { CreateUserDto } from '@dtos/create-user.dto';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { UsersService } from './services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(
    private dataSource: DataSource,
    private usersService: UsersService,
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, UserEntity),
  )
  async createUser(@Body() body: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.usersService.create(queryRunner, body);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Будь ласка, спробуйте ще раз трішки пізніше.',
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserById(@Param('id') id: string) {
    return this.usersService.showById(id);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUsers(@User('id') userId: string) {
    return this.usersService.getAll(userId);
  }

  @Post('confirm')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async confirmUser(@Body('userId') userId: string) {
    return this.usersService.confirmUser(userId);
  }

  @Post('freeze-toggle')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async freezeToggleUser(@Body('userId') userId: string) {
    return this.usersService.freezeToggleUser(userId);
  }
}
