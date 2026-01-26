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
    console.log(
      '[PaymentApiService] presearch() called with accountNumber:',
      accountNumber,
    );
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    console.log('[PaymentApiService] presearch() - QueryRunner connected');
    await queryRunner.startTransaction();
    console.log('[PaymentApiService] presearch() - Transaction started');
    try {
      console.log(
        '[PaymentApiService] presearch() - Searching for user with accountNumber:',
        accountNumber,
      );
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
      });
      console.log('[PaymentApiService] presearch() - User found:', {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        accountNumber: user.accountNumber,
      });
      await queryRunner.commitTransaction();
      console.log(
        '[PaymentApiService] presearch() - Transaction committed successfully',
      );
      const response = new PresearchResponse({
        fio: [`${user.lastName} ${user.firstName} ${user.middleName}`],
        ls: [user.accountNumber!],
      });
      console.log(
        '[PaymentApiService] presearch() - Returning success response:',
        response,
      );
      return Promise.resolve(response);
    } catch (err) {
      console.error(
        '[PaymentApiService] presearch() - Error occurred:',
        err instanceof Error ? err.message : String(err),
      );
      console.error(
        '[PaymentApiService] presearch() - Full error details:',
        err,
      );
      return Promise.resolve(
        new ErrorResponse({
          message: 'Уточните поисковые реквизиты',
          code: ErrorCode.ANOTHER_ERROR,
        }),
      );
    } finally {
      await queryRunner.release();
      console.log('[PaymentApiService] presearch() - QueryRunner released');
    }
  }

  async search(accountNumber: string): Promise<SearchResponse | ErrorResponse> {
    console.log(
      '[PaymentApiService] search() called with accountNumber:',
      accountNumber,
    );
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    console.log('[PaymentApiService] search() - QueryRunner connected');
    await queryRunner.startTransaction();
    console.log('[PaymentApiService] search() - Transaction started');
    try {
      console.log(
        '[PaymentApiService] search() - Searching for user with accountNumber:',
        accountNumber,
      );
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
      });
      console.log('[PaymentApiService] search() - User found:', {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
      await queryRunner.commitTransaction();
      console.log(
        '[PaymentApiService] search() - Transaction committed successfully',
      );
      const response = new SearchResponse({
        billIdentifier: user.accountNumber!,
        serviceCode: '1',
        fio: `${user.lastName} ${user.firstName} ${user.middleName}`,
        phone: user.phoneNumber,
      });
      console.log(
        '[PaymentApiService] search() - Returning success response:',
        response,
      );
      return Promise.resolve(response);
    } catch (err) {
      console.error(
        '[PaymentApiService] search() - Error occurred:',
        err instanceof Error ? err.message : String(err),
      );
      console.error('[PaymentApiService] search() - Full error details:', err);
      return Promise.resolve(
        new ErrorResponse({
          message: 'Абонент не найден',
          code: ErrorCode.USER_NOT_FOUND,
        }),
      );
    } finally {
      await queryRunner.release();
      console.log('[PaymentApiService] search() - QueryRunner released');
    }
  }

  async check(
    bankTransactionId: string,
    accountNumber: string | undefined,
    amount: string,
  ): Promise<CheckResponse | ErrorResponse> {
    console.log('[PaymentApiService] check() called with:', {
      bankTransactionId,
      accountNumber,
      amount,
    });
    if (!accountNumber) {
      console.warn('[PaymentApiService] check() - accountNumber is missing');
      return Promise.resolve(
        new ErrorResponse({
          message: 'Payer Info, Bill Identifier is required',
          code: ErrorCode.ANOTHER_ERROR,
        }),
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    console.log('[PaymentApiService] check() - QueryRunner connected');
    await queryRunner.startTransaction();
    console.log('[PaymentApiService] check() - Transaction started');
    try {
      console.log(
        '[PaymentApiService] check() - Searching for user with accountNumber:',
        accountNumber,
      );
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { accountNumber },
        relations: ['balance'],
      });
      console.log('[PaymentApiService] check() - User found:', {
        id: user.id,
        accountNumber: user.accountNumber,
        balance: user.balance?.amount,
      });
      const amountNum = +amount;
      console.log(
        '[PaymentApiService] check() - Creating payment transaction with amount:',
        amountNum,
      );
      const transaction = await queryRunner.manager.save(
        PaymentTransactionEntity,
        {
          bankTransactionId,
          balance: user.balance,
          amount: amountNum,
          netBalance: user.balance.amount.plus(amountNum),
        },
      );
      console.log(
        '[PaymentApiService] check() - Payment transaction created successfully:',
        {
          id: transaction.id,
          bankTransactionId: transaction.bankTransactionId,
          amount: transaction.amount,
          netBalance: transaction.netBalance,
        },
      );
      await queryRunner.commitTransaction();
      console.log(
        '[PaymentApiService] check() - Transaction committed successfully',
      );
      const response = new CheckResponse({
        checkReference: transaction.id,
      });
      console.log(
        '[PaymentApiService] check() - Returning success response:',
        response,
      );
      return Promise.resolve(response);
    } catch (err) {
      console.error(
        '[PaymentApiService] check() - Error occurred:',
        err instanceof Error ? err.message : String(err),
      );
      console.error('[PaymentApiService] check() - Full error details:', err);
      await queryRunner.rollbackTransaction();
      console.log('[PaymentApiService] check() - Transaction rolled back');
      return Promise.resolve(
        new ErrorResponse({
          message: 'Неверный формат даты',
          code: ErrorCode.INVALID_DATA,
        }),
      );
    } finally {
      await queryRunner.release();
      console.log('[PaymentApiService] check() - QueryRunner released');
    }
  }

  async pay(
    transactionId: string | null,
  ): Promise<PayResponse | ErrorResponse> {
    console.log(
      '[PaymentApiService] pay() called with transactionId:',
      transactionId,
    );
    if (!transactionId) {
      console.warn(
        '[PaymentApiService] pay() - transactionId is missing or null',
      );
      return Promise.resolve(
        new ErrorResponse({
          message: 'Company Info => Check Reference is required',
          code: ErrorCode.ANOTHER_ERROR,
        }),
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    console.log('[PaymentApiService] pay() - QueryRunner connected');
    await queryRunner.startTransaction();
    console.log('[PaymentApiService] pay() - Transaction started');
    try {
      console.log(
        '[PaymentApiService] pay() - Searching for payment transaction with id:',
        transactionId,
      );
      const transaction = await queryRunner.manager.findOneOrFail(
        PaymentTransactionEntity,
        { where: { id: transactionId } },
      );
      console.log('[PaymentApiService] pay() - Payment transaction found:', {
        id: transaction.id,
        bankTransactionId: transaction.bankTransactionId,
        amount: transaction.amount,
        netBalance: transaction.netBalance,
      });

      console.log(
        '[PaymentApiService] pay() - Calling balanceService.fulfillTransaction() with transactionId:',
        transactionId,
      );
      try {
        await this.balanceService.fulfillTransaction(transaction.id);
        console.log(
          '[PaymentApiService] pay() - balanceService.fulfillTransaction() completed successfully',
        );
      } catch (balanceErr) {
        console.error(
          '[PaymentApiService] pay() - balanceService.fulfillTransaction() failed:',
          balanceErr instanceof Error ? balanceErr.message : String(balanceErr),
        );
        console.error(
          '[PaymentApiService] pay() - Full error details:',
          balanceErr,
        );
        throw balanceErr;
      }

      await queryRunner.commitTransaction();
      console.log(
        '[PaymentApiService] pay() - Transaction committed successfully',
      );
      const response = new PayResponse({
        payReference: transaction.id,
      });
      console.log(
        '[PaymentApiService] pay() - Returning success response:',
        response,
      );
      return Promise.resolve(response);
    } catch (err) {
      console.error(
        '[PaymentApiService] pay() - Error occurred:',
        err instanceof Error ? err.message : String(err),
      );
      console.error('[PaymentApiService] pay() - Full error details:', err);
      try {
        await queryRunner.rollbackTransaction();
        console.log('[PaymentApiService] pay() - Transaction rolled back');
      } catch (rollbackErr) {
        console.error(
          '[PaymentApiService] pay() - Rollback failed:',
          rollbackErr instanceof Error
            ? rollbackErr.message
            : String(rollbackErr),
        );
      }
      return Promise.resolve(
        new ErrorResponse({
          message: 'Неверный формат даты',
          code: ErrorCode.INVALID_DATA,
        }),
      );
    } finally {
      await queryRunner.release();
      console.log('[PaymentApiService] pay() - QueryRunner released');
    }
  }

  async cancel(
    bankTransactionId: string,
    amount: string,
  ): Promise<CancelResponse | ErrorResponse> {
    console.log('[PaymentApiService] cancel() called with:', {
      bankTransactionId,
      amount,
    });
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    console.log('[PaymentApiService] cancel() - QueryRunner connected');
    await queryRunner.startTransaction();
    console.log('[PaymentApiService] cancel() - Transaction started');
    try {
      console.log(
        '[PaymentApiService] cancel() - Searching for payment transaction with bankTransactionId:',
        bankTransactionId,
      );
      const transaction = await queryRunner.manager.findOneOrFail(
        PaymentTransactionEntity,
        { where: { bankTransactionId } },
      );
      console.log('[PaymentApiService] cancel() - Payment transaction found:', {
        id: transaction.id,
        bankTransactionId: transaction.bankTransactionId,
        amount: transaction.amount,
      });
      const amountNum = +amount;
      console.log(
        '[PaymentApiService] cancel() - Calling balanceService.cancelTransactionBanking() with amount:',
        amountNum,
      );
      try {
        await this.balanceService.cancelTransactionBanking(
          queryRunner.manager,
          amountNum,
          bankTransactionId,
          transaction,
        );
        console.log(
          '[PaymentApiService] cancel() - balanceService.cancelTransactionBanking() completed successfully',
        );
      } catch (balanceErr) {
        console.error(
          '[PaymentApiService] cancel() - balanceService.cancelTransactionBanking() failed:',
          balanceErr instanceof Error ? balanceErr.message : String(balanceErr),
        );
        console.error(
          '[PaymentApiService] cancel() - Full error details:',
          balanceErr,
        );
        throw balanceErr;
      }

      await queryRunner.commitTransaction();
      console.log(
        '[PaymentApiService] cancel() - Transaction committed successfully',
      );
      const response = new CancelResponse({
        cancelReference: transaction.id,
      });
      console.log(
        '[PaymentApiService] cancel() - Returning success response:',
        response,
      );
      return Promise.resolve(response);
    } catch (err) {
      console.error(
        '[PaymentApiService] cancel() - Error occurred:',
        err instanceof Error ? err.message : String(err),
      );
      console.error('[PaymentApiService] cancel() - Full error details:', err);
      try {
        await queryRunner.rollbackTransaction();
        console.log('[PaymentApiService] cancel() - Transaction rolled back');
      } catch (rollbackErr) {
        console.error(
          '[PaymentApiService] cancel() - Rollback failed:',
          rollbackErr instanceof Error
            ? rollbackErr.message
            : String(rollbackErr),
        );
      }
      return Promise.resolve(
        new ErrorResponse({
          message: 'Неверный формат даты',
          code: ErrorCode.INVALID_DATA,
        }),
      );
    } finally {
      await queryRunner.release();
      console.log('[PaymentApiService] cancel() - QueryRunner released');
    }
  }

  async upload(): Promise<UploadResponse> {
    console.log('[PaymentApiService] upload() called');
    const response = new UploadResponse({
      uploadReference: '1210236',
    });
    console.log('[PaymentApiService] upload() - Returning response:', response);
    return Promise.resolve(response);
  }

  calc(payments: any) {
    console.log(
      '[PaymentApiService] calc() called with payments count:',
      payments?.length,
    );
    const result = payments.map((payment: any) => {
      const mapped = {
        id: payment.id,
        serviceInfo: {
          codifier: payment.serviceInfo.codifier,
          commissSum: 0,
        },
      };
      console.log('[PaymentApiService] calc() - Mapped payment:', mapped);
      return mapped;
    });
    console.log(
      '[PaymentApiService] calc() - Returning result with',
      result.length,
      'items',
    );
    return result;
  }
}
