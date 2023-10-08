import { DataSource, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { PaymentTransactionsPageOptionsDto } from '@dtos/payment-transactions-page-options.dto';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';
import { Role } from '@enums/role.enum';
import { SortOrder } from '@enums/sort-order.enum';
import { PageMeta } from '@interfaces/page-meta.interface';
import { Page } from '@interfaces/page.interface';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class PaymentTransactionsService {
  constructor(
    private dataSource: DataSource,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getPaymentTransactions(
    currentUserId: string,
    pageOptionsDto: PaymentTransactionsPageOptionsDto,
    userId?: string,
  ): Promise<Page<PaymentTransactionEntity>> {
    const manager = this.dataSource.createEntityManager();
    const user = await manager.findOneOrFail(UserEntity, {
      where: { id: currentUserId },
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    const queryBuilder = this.getPaymentTransactionQuery();

    if (userId) {
      queryBuilder.andWhere('owner.id = :userId', {
        userId,
      });
    } else if (user.role === Role.User) {
      queryBuilder.andWhere('owner.id = :currentUserId', {
        currentUserId,
      });
    }

    if (pageOptionsDto.createdAt) {
      const startDate = new Date(pageOptionsDto.createdAt);
      const endDate = new Date(pageOptionsDto.createdAt);
      endDate.setHours(23, 59, 59, 999);
      queryBuilder
        .andWhere('paymentTransaction.createdAt >= :startDate', { startDate })
        .andWhere('paymentTransaction.createdAt <= :endDate', { endDate });
    }

    if (pageOptionsDto.searchQuery) {
      queryBuilder.andWhere('paymentTransaction.amount LIKE :searchQuery', {
        searchQuery: `%${pageOptionsDto.searchQuery}%`,
      });
    }

    if (pageOptionsDto.orderBy) {
      queryBuilder.orderBy(
        `paymentTransaction.${pageOptionsDto.orderBy}`,
        pageOptionsDto.order,
      );
    } else {
      queryBuilder.orderBy(`paymentTransaction.createdAt`, SortOrder.DESC);
    }

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const paymentTransactions: PaymentTransactionEntity[] = entities.map(
      (paymentTransaction) => sanitizeEntity(ability, paymentTransaction),
    );

    const pageMetaDto = new PageMeta({ itemCount, pageOptionsDto });

    return new Page(paymentTransactions, pageMetaDto);
  }

  private getPaymentTransactionQuery(
    id?: string,
  ): SelectQueryBuilder<PaymentTransactionEntity> {
    const query = this.dataSource.createQueryBuilder(
      PaymentTransactionEntity,
      'paymentTransaction',
    );

    if (id) {
      query.where('paymentTransaction.id = :id', { id });
    }

    query
      .leftJoinAndSelect('paymentTransaction.order', 'order')
      .leftJoinAndSelect(
        'paymentTransaction.orderReturnRequest',
        'orderReturnRequest',
      )
      .leftJoinAndSelect(
        'orderReturnRequest.request',
        'orderReturnRequestParentRequest',
      )
      .leftJoinAndSelect(
        'paymentTransaction.fundsWithdrawalRequest',
        'fundsWithdrawalRequest',
      )
      .leftJoinAndSelect(
        'fundsWithdrawalRequest.request',
        'fundsWithdrawalParentRequest',
      )
      .leftJoinAndSelect('paymentTransaction.balance', 'balance')
      .leftJoinAndSelect('balance.owner', 'owner');

    return query;
  }
}
