import { Observable } from 'rxjs';
import { Repository } from 'typeorm';

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UserFreezeInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const userToken = context.switchToHttp().getRequest().user;
    if (userToken && userToken.user) {
      const user = await this.usersRepository.findOneByOrFail({
        id: userToken.user.id,
      });

      if (user.userFreezed === true) {
        throw new HttpException('Акаунт призупинено', 406);
      }
    }

    return next.handle();
  }
}
