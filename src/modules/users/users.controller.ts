import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Action } from '@enums/action.enum';
import { UserEntity } from '@entities/user.entity';
import { CreateUserDto } from '@dtos/create-user.dto';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { UsersService } from './services/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailService } from '../mail/services/mail.service';
import { TestMail } from '../mail/test.mail';

@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, UserEntity),
  )
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.showById(id);
    // TODO: Remove after testing
    await this.mailService.send(new TestMail(user), 'maxcharuk@gmail.com');
    return user;
  }
}
