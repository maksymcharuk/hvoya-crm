import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Observable } from 'rxjs';
import { Repository } from 'typeorm';

import { UserEntity } from '@entities/user.entity';

@Injectable()
export class UserFreezeInterceptor implements NestInterceptor {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    if (context.switchToHttp().getRequest().user) {
      const user = await this.usersRepository.findOneByOrFail({ id: context.switchToHttp().getRequest().user.user.id });

      if (user.userFreezed === true) {
        throw new HttpException('User is freezed', 406);
      }
    }

    return next.handle();
  }
}
