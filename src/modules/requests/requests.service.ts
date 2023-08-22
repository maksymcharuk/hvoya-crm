import { DataSource } from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { RejectReturnRequestDto } from '@dtos/reject-return-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { RequestType } from '@enums/request-type.enum';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';

import { RequestContext } from './core/request-context';
import { ReturnRequestsStrategy } from './strategies/return-requests/return-requests.strategy';

@Injectable()
export class RequestsService {
  constructor(
    private dataSource: DataSource,
    private requestContext: RequestContext,
    private returnRequestsStrategy: ReturnRequestsStrategy,
    private caslAbilityFactory: CaslAbilityFactory,
    private eventEmitter: EventEmitter2,
  ) {}

  async getRequests(userId: string): Promise<RequestEntity[]> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: userId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const requests = await this.dataSource.manager.find(RequestEntity, {
      relations: ['returnRequest', 'customer', 'returnRequest.delivery'],
      order: {
        createdAt: 'DESC',
      },
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
        'customerImages',
        'customer',
      ],
      where: { number: number },
    });

    if (ability.cannot(Action.Read, request)) {
      throw new HttpException(
        'У вас немає прав для перегляду цього запиту',
        HttpStatus.FORBIDDEN,
      );
    }

    return sanitizeEntity(ability, request);
  }

  async createRequest(
    userId: string,
    createRequestDto: CreateRequestDto,
    waybill?: Express.Multer.File,
    customerImages?: Express.Multer.File[],
  ): Promise<RequestEntity> {
    switch (createRequestDto.requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestsStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }

    const r = await this.requestContext.createRequest(
      userId,
      createRequestDto,
      waybill,
      customerImages,
    );

    const request = await this.getRequest(userId, r.number!);

    this.eventEmitter.emit(NotificationEvent.RequestCreated, {
      data: this.dataSource.manager.create(RequestEntity, request),
      type: NotificationType.RequestCreated,
    });

    return request;
  }

  async approveRequest(
    userId: string,
    requestNumber: string,
    approveRequestDto: ApproveReturnRequestDto,
    managerImages?: Express.Multer.File[],
  ): Promise<RequestEntity> {
    let r = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: requestNumber },
    });

    switch (r.requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestsStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }

    await this.requestContext.approveRequest(
      userId,
      requestNumber,
      approveRequestDto,
      managerImages,
    );

    const request = await this.getRequest(userId, r.number!);

    this.eventEmitter.emit(NotificationEvent.RequestApproved, {
      data: this.dataSource.manager.create(RequestEntity, request),
      type: NotificationType.RequestApproved,
      userId: request.customer.id,
    });

    return request;
  }

  async rejectRequest(
    userId: string,
    requestNumber: string,
    rejectRequestDto: RejectReturnRequestDto,
    managerImages?: Express.Multer.File[],
  ): Promise<RequestEntity> {
    let r = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: requestNumber },
    });

    switch (r.requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestsStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }

    await this.requestContext.rejectRequest(
      userId,
      requestNumber,
      rejectRequestDto,
      managerImages,
    );

    const request = await this.getRequest(userId, r.number!);

    this.eventEmitter.emit(NotificationEvent.RequestRejected, {
      data: this.dataSource.manager.create(RequestEntity, request),
      type: NotificationType.RequestRejected,
      userId: request.customer.id,
    });

    return request;
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
        this.requestContext.setStrategy(this.returnRequestsStrategy);
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
