import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';

import { BalanceService } from '../../../../balance/services/balance.service';
import { ErrorCode } from '../enums/error-code.enum';
import { CancelResponse } from '../interfaces/responses/cancel.response';
import { CheckResponse } from '../interfaces/responses/check.response';
import { ErrorResponse } from '../interfaces/responses/error.response';
import { PayResponse } from '../interfaces/responses/pay.response';
import { PresearchResponse } from '../interfaces/responses/presearch.response';
import { SearchResponse } from '../interfaces/responses/search.response';
import { UploadResponse } from '../interfaces/responses/upload.response';

@Injectable()
export class PaymentApiService {
  constructor(
    private dataSource: DataSource,
    private balanceService: BalanceService,
  ) {}

  async presearch(
    accountNumber: string,
  ): Promise<PresearchResponse | ErrorResponse> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
      });
      await queryRunner.commitTransaction();
      return Promise.resolve(
        new PresearchResponse({
          fio: [`${user.lastName} ${user.firstName} ${user.middleName}`],
          ls: [user.accountNumber!],
        }),
      );
    } catch (err) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Уточните поисковые реквизиты',
          code: ErrorCode.ANOTHER_ERROR,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async search(accountNumber: string): Promise<SearchResponse | ErrorResponse> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
      });
      await queryRunner.commitTransaction();
      return Promise.resolve(
        new SearchResponse({
          billIdentifier: user.accountNumber!,
          serviceCode: '1',
          fio: `${user.lastName} ${user.firstName} ${user.middleName}`,
          phone: user.phoneNumber,
        }),
      );
    } catch (err) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Абонент не найден',
          code: ErrorCode.USER_NOT_FOUND,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async check(
    bankTransactionId: string,
    accountNumber: string | undefined,
  ): Promise<CheckResponse | ErrorResponse> {
    if (!accountNumber) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Payer Info, Bill Identifier is required',
          code: ErrorCode.ANOTHER_ERROR,
        }),
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
        relations: ['balance'],
      });
      const transaction = await queryRunner.manager.save(
        PaymentTransactionEntity,
        { bankTransactionId, balance: user.balance },
      );
      await queryRunner.commitTransaction();
      return Promise.resolve(
        new CheckResponse({
          checkReference: transaction.id,
        }),
      );
    } catch (err) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Неверный формат даты',
          code: ErrorCode.INVALID_DATA,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async pay(
    accountNumber: string,
    bankTransactionId: string,
    transactionId: string | null,
    amount: string,
  ): Promise<PayResponse | ErrorResponse> {
    if (!transactionId) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Company Info => Check Reference is required',
          code: ErrorCode.ANOTHER_ERROR,
        }),
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
      });
      const transaction = await queryRunner.manager.findOneOrFail(
        PaymentTransactionEntity,
        { where: { id: transactionId } },
      );
      await this.balanceService.addFundsBanking(
        queryRunner.manager,
        user.id,
        +amount,
        bankTransactionId,
        transaction,
      );
      await queryRunner.commitTransaction();
      return Promise.resolve(
        new PayResponse({
          payReference: transaction.id,
        }),
      );
    } catch (err) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Неверный формат даты',
          code: ErrorCode.INVALID_DATA,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(
    accountNumber: string,
    bankTransactionId: string,
    amount: string,
  ): Promise<CancelResponse | ErrorResponse> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
      });
      const transaction = await queryRunner.manager.findOneOrFail(
        PaymentTransactionEntity,
        { where: { bankTransactionId } },
      );
      await this.balanceService.cancelTransactionBanking(
        queryRunner.manager,
        user.id,
        +amount,
        bankTransactionId,
        transaction,
      );
      await queryRunner.commitTransaction();
      return Promise.resolve(
        new CancelResponse({
          cancelReference: transaction.id,
        }),
      );
    } catch (err) {
      return Promise.resolve(
        new ErrorResponse({
          message: 'Неверный формат даты',
          code: ErrorCode.INVALID_DATA,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async upload(): Promise<UploadResponse> {
    return Promise.resolve(
      new UploadResponse({
        uploadReference: '1210236',
      }),
    );
  }

  calc(payments: any) {
    return payments.map((payment: any) => {
      return {
        id: payment.id,
        serviceInfo: {
          codifier: payment.serviceInfo.codifier,
          commissSum: 0,
        },
      };
    });
  }
}
