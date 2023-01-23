import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { Action } from '@enums/action.enum';
import { UserEntity } from '@entities/user.entity';
import { User } from '@decorators/user.decorator';
import { UpdateProfileDto } from '@dtos/update-profile.dto';
import { ChangePasswordDto } from '@dtos/change-password.dto';

import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountService } from './services/account.service';

@Controller('account')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('profile')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async findById(@User('id') id: number) {
    return this.accountService.findById(id);
  }

  @Put('profile')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async updateProfile(
    @User('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.accountService.updateProfile(id, updateProfileDto);
  }

  @Put('change-password')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, UserEntity),
  )
  async changePassword(
    @User('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.accountService.changePassword(id, changePasswordDto);
  }
}
