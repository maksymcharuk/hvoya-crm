import { DataSource, SelectQueryBuilder } from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RequestsPageOptionsDto } from '@dtos/requests-page-options.dto';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { RequestType } from '@enums/request-type.enum';
import { Role } from '@enums/role.enum';
import { SortOrder } from '@enums/sort-order.enum';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';

import { RequestContext } from './core/request-context';
import { ApproveRequestContextDto } from './interfaces/approve-request-strategy.dto';
import { CreateRequestContextDto } from './interfaces/create-request-strategy.dto';
import { RejectRequestContextDto } from './interfaces/reject-request-strategy.dto';
import { RestoreRequestContextDto } from './interfaces/restore-request-strategy.dto';
import { UpdateRequestByCustomerContextDto } from './interfaces/update-request-by-customer.strategy.dto';
import { FundsWithdrawRequestsStrategy } from './strategies/funds-withdraw-requests/funds-withdraw-requests.strategy';
import { ReturnRequestsStrategy } from './strategies/return-requests/return-requests.strategy';

@Injectable()
export class RequestsService {
  constructor(
    private dataSource: DataSource,
    private requestContext: RequestContext,
    private returnRequestsStrategy: ReturnRequestsStrategy,
    private fundsWithdrawalRequestsStrategy: FundsWithdrawRequestsStrategy,
    private caslAbilityFactory: CaslAbilityFactory,
    private eventEmitter: EventEmitter2,
  ) {}

  async getRequests(
    currentUserId: string,
    pageOptionsDto: RequestsPageOptionsDto,
    userId?: string,
  ): Promise<Page<RequestEntity>> {
    const manager = this.dataSource.createEntityManager();

    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: currentUserId },
    });
    const ability = this.caslAbilityFactory.createForUser(user);

    const queryBuilder = this.getRequestQuery();

    if (userId) {
      queryBuilder.andWhere('request.customer = :userId', { userId });
    } else if (user.role === Role.User) {
      queryBuilder.andWhere('request.customer = :currentUserId', {
        currentUserId,
      });
    }

    if (pageOptionsDto.createdAt) {
      const startDate = new Date(pageOptionsDto.createdAt);
      const endDate = new Date(pageOptionsDto.createdAt);
      endDate.setHours(23, 59, 59, 999);
      queryBuilder
        .andWhere('request.createdAt >= :startDate', { startDate })
        .andWhere('request.createdAt <= :endDate', { endDate });
    }

    if (pageOptionsDto.customerIds && pageOptionsDto.customerIds.length > 0) {
      queryBuilder.andWhere('customer.id IN (:...customerIds)', {
        customerIds: pageOptionsDto.customerIds,
      });
    }

    if (pageOptionsDto.requestStatus) {
      queryBuilder.andWhere(
        'returnRequest.status = :requestStatus OR fundsWithdrawalRequest.status = :requestStatus',
        {
          requestStatus: pageOptionsDto.requestStatus,
        },
      );
    }

    if (pageOptionsDto.requestType) {
      queryBuilder.andWhere('request.requestType = :requestType', {
        requestType: pageOptionsDto.requestType,
      });
    }

    if (pageOptionsDto.orderReturnRequestDeliveryStatus) {
      queryBuilder.andWhere(
        'delivery.status = :orderReturnRequestDeliveryStatus',
        {
          orderReturnRequestDeliveryStatus:
            pageOptionsDto.orderReturnRequestDeliveryStatus,
        },
      );
    }

    if (pageOptionsDto.searchQuery) {
      queryBuilder.andWhere(
        'request.number LIKE LOWER(:searchQuery) OR LOWER(delivery.trackingId) LIKE LOWER(:searchQuery)',
        {
          searchQuery: `%${pageOptionsDto.searchQuery}%`,
        },
      );
    }

    if (pageOptionsDto.orderBy) {
      queryBuilder.orderBy(
        `request.${pageOptionsDto.orderBy}`,
        pageOptionsDto.order,
      );
    } else {
      queryBuilder.orderBy(`request.createdAt`, SortOrder.DESC);
    }

    if (pageOptionsDto.take !== 0) {
      queryBuilder.take(pageOptionsDto.take);
    }

    queryBuilder.skip(pageOptionsDto.skip);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const requests = entities.map((request) =>
      sanitizeEntity<RequestEntity>(ability, request),
    );

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(requests, pageMetaDto);
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
        'fundsWithdrawalRequest.fundsWithdrawalReceipt',
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

  async createRequest(data: CreateRequestContextDto): Promise<RequestEntity> {
    this.setStrategy(data.createRequestDto.requestType);

    const r = await this.requestContext.createRequest(data);

    const request = await this.getRequest(data.userId, r.number!);

    this.eventEmitter.emit(NotificationEvent.RequestCreated, {
      data: this.dataSource.manager.create(RequestEntity, request),
      type: NotificationType.RequestCreated,
    });

    return request;
  }

  async approveRequest(data: ApproveRequestContextDto): Promise<RequestEntity> {
    let r = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: data.requestNumber },
    });

    this.setStrategy(r.requestType);

    await this.requestContext.approveRequest(data);

    const request = await this.getRequest(data.userId, r.number!);

    this.eventEmitter.emit(NotificationEvent.RequestApproved, {
      data: this.dataSource.manager.create(RequestEntity, request),
      type: NotificationType.RequestApproved,
      userId: request.customer.id,
    });

    return request;
  }

  async rejectRequest(data: RejectRequestContextDto): Promise<RequestEntity> {
    let r = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: data.requestNumber },
    });

    this.setStrategy(r.requestType);

    await this.requestContext.rejectRequest(data);

    const request = await this.getRequest(data.userId, r.number!);

    this.eventEmitter.emit(NotificationEvent.RequestRejected, {
      data: this.dataSource.manager.create(RequestEntity, request),
      type: NotificationType.RequestRejected,
      userId: request.customer.id,
    });

    return request;
  }

  async updateRequestByCustomer(
    data: UpdateRequestByCustomerContextDto,
  ): Promise<RequestEntity> {
    const request = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: data.requestNumber },
    });

    this.setStrategy(request.requestType);

    await this.requestContext.updateRequestByCustomer(data);

    return this.getRequest(data.userId, request.number!);
  }

  async restoreRequest(data: RestoreRequestContextDto): Promise<RequestEntity> {
    let r = await this.dataSource.manager.findOneOrFail(RequestEntity, {
      where: { number: data.requestNumber },
    });

    this.setStrategy(r.requestType);

    await this.requestContext.restoreRequest(data);

    return this.getRequest(data.userId, r.number!);
  }

  private getRequestQuery(number?: string): SelectQueryBuilder<RequestEntity> {
    const query = this.dataSource.createQueryBuilder(RequestEntity, 'request');

    if (number) {
      query.where('request.number = :number', { number });
    }

    query
      .leftJoinAndSelect('request.returnRequest', 'returnRequest')
      .leftJoinAndSelect('returnRequest.delivery', 'delivery')
      .leftJoinAndSelect(
        'request.fundsWithdrawalRequest',
        'fundsWithdrawalRequest',
      )
      .leftJoinAndSelect('request.customer', 'customer');

    return query;
  }

  private setStrategy(requestType: RequestType) {
    switch (requestType) {
      case RequestType.Return:
        this.requestContext.setStrategy(this.returnRequestsStrategy);
        break;
      case RequestType.FundsWithdrawal:
        this.requestContext.setStrategy(this.fundsWithdrawalRequestsStrategy);
        break;
      default:
        throw new BadRequestException('Невідомий тип запиту');
    }
  }
}
