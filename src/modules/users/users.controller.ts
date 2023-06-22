import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { UsersService } from './services/users.service';
import { UpdateUserByAdminDto } from '@dtos/update-user-by-admin.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserById(@Param('id') id: string) {
    return this.usersService.showById(id);
  }

  @Get(':id/full')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserByIdFull(
    @User('id') currentUserId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.findByIdFull(id, currentUserId);
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

  @Post(':id/update-by-admin')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.SuperUpdate, UserEntity),
  )
  async update(@Param('id') userId: string, @Body() userUpgrade: UpdateUserByAdminDto) {
    return this.usersService.update({ ...userUpgrade, id: userId });
  }
}
