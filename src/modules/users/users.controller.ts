import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { ConfirmUserDto } from '@dtos/confirm-user.dto';
import { SendAdminInvitationDto } from '@dtos/send-admin-invitation.dto';
import { UpdateUserByAdminDto } from '@dtos/update-user-by-admin.dto';
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
  constructor(private usersService: UsersService) {}

  @Get('admins')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getAllAdmins(@User('id') userId: string) {
    return this.usersService.getAllAdmins(userId);
  }

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

  @Post(':id/update-by-admin')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.SuperUpdate, UserEntity),
  )
  async update(
    @Param('id') userId: string,
    @Body() userUpgrade: UpdateUserByAdminDto,
  ) {
    return this.usersService.update({ ...userUpgrade, id: userId });
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
  async confirmUser(
    @User('id') currentUserId: string,
    @Body() confirmUserDto: ConfirmUserDto,
  ) {
    return this.usersService.confirmUser(confirmUserDto, currentUserId);
  }

  @Post('freeze-toggle')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async freezeToggleUser(@Body('userId') userId: string) {
    return this.usersService.freezeToggleUser(userId);
  }

  @Post('send-admin-invitation')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, UserEntity),
  )
  async sendAdminInvitation(
    @Body() sendAdminInvitationDto: SendAdminInvitationDto,
  ) {
    return this.usersService.sendAdminInvitation(sendAdminInvitationDto);
  }
}
