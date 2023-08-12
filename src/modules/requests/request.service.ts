import { DataSource } from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { RequestType } from '@enums/request-type.enum';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';

import { RequestContext } from './core/request-context';
import { ReturnRequestStrategy } from './strategies/return-requests/return-request.strategy';

@Injectable()
export class RequestService {
  constructor(
    private dataSource: DataSource,
    private requestContext: RequestContext,
    private returnRequestStrategy: ReturnRequestStrategy,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getRequests(userId: string): Promise<RequestEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const requests = await this.dataSource.manager.find(RequestEntity, {
      relations: ['returnRequest', 'customer', 'returnRequest.delivery'],
    });

    return requests
      .filter((request) => ability.can(Action.Read, request))
      .map((request) => sanitizeEntity(ability, request));
  }

  async getRequest(userId: string, number: string): Promise<RequestEntity> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const request = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      relations: [
        'returnRequest.requestedItems.orderItem.productProperties.images',
        'returnRequest.requestedItems.orderItem.product.baseProduct',
        'returnRequest.approvedItems.orderItem.productProperties.images',
        'returnRequest.approvedItems.orderItem.product.baseProduct',
        'returnRequest.order',
        'returnRequest.delivery',
        'customer',
      ],
      where: { number: number },
    });

    if (ability.cannot(Action.Read, request)) {
      throw new HttpException(
        'У вас немає прав для перегляду цього замовлення',
        HttpStatus.FORBIDDEN,
      );
    }

    return sanitizeEntity(ability, request);
  }

  async createRequest(
    userId: string,
    createRequestDto: CreateRequestDto,
    waybill?: Express.Multer.File,
  ): Promise<RequestEntity> {
    switch (createRequestDto.requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }

    const request = await this.requestContext.createRequest(
      userId,
      createRequestDto,
      waybill,
    );

    return this.getRequest(userId, request.number!);
  }

  async approveRequest(
    userId: string,
    requestNumber: string,
    approveRequestDto: ApproveReturnRequestDto,
  ): Promise<RequestEntity> {
    const request = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: requestNumber },
    });

    switch (request.requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }

    await this.requestContext.approveRequest(
      userId,
      requestNumber,
      approveRequestDto,
    );

    return this.getRequest(userId, request.number!);
  }

  async updateRequestByCustomer(
    userId: string,
    requestNumber: string,
    updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    waybill?: Express.Multer.File,
  ): Promise<RequestEntity> {
    const request = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: requestNumber },
    });

    switch (request.requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }

    await this.requestContext.updateRequestByCustomer(
      userId,
      requestNumber,
      updateRequestByCustomerDto,
      waybill,
    );

    return this.getRequest(userId, request.number!);
  }
}
