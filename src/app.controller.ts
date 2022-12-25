import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './modules/user/services/user.service';

@Controller()
export class AppController {
  constructor(private userService: UserService) {}

  @Post('test')
  createHelloWorld(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get('test/:id')
  getHelloWorld(@Param('id') id: string) {
    return this.userService.findById(+id);
  }
}
