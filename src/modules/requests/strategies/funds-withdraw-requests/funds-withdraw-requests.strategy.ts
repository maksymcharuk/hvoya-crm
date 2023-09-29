import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { BalanceEntity } from '@entities/balance.entity';
import { FileEntity } from '@entities/file.entity';
import { FundsWithdrawRequestEntity } from '@entities/funds-withdraw-request.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { Folder } from '@enums/folder.enum';
import { FundsWithdrawRequestStatus } from '@enums/funds-withdraw-request-status.enum';
import { TransactionStatus } from '@enums/transaction-status.enum';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { FilesService } from '@modules/files/services/files.service';
import { RequestStrategy } from '@modules/requests/core/request-strategy.interface';
import { ApproveRequestStrategyDto } from '@modules/requests/interfaces/approve-request-strategy.dto';
import { CreateRequestStrategyDto } from '@modules/requests/interfaces/create-request-strategy.dto';
import { RejectRequestStrategyDto } from '@modules/requests/interfaces/reject-request-strategy.dto';
import { UpdateRequestByCustomerContextDto } from '@modules/requests/interfaces/update-request-by-customer.strategy.dto';

@Injectable()
export class FundsWithdrawRequestsStrategy implements RequestStrategy {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly filesService: FilesService,
  ) {}

  async createRequest(data: CreateRequestStrategyDto): Promise<RequestEntity> {
    const balance = await data.queryRunner.manager.findOneOrFail(
      BalanceEntity,
      {
        where: { owner: { id: data.userId } },
      },
    );

    if (
      balance.amount.lessThan(
        data.createRequestDto.fundsWithdrawalRequest.amount,
      )
    ) {
      throw new BadRequestException(
        'Сума заявки перевищує суму доступних коштів',
      );
    }

    const fundsWithdrawalRequest = await data.queryRunner.manager.save(
      FundsWithdrawRequestEntity,
      {
        amount: data.createRequestDto.fundsWithdrawalRequest.amount,
      },
    );

    await data.queryRunner.manager.save(PaymentTransactionEntity, {
      amount: data.createRequestDto.fundsWithdrawalRequest.amount.neg(),
      status: TransactionStatus.Success,
      balance: { id: balance.id },
      fundsWithdrawalRequest: { id: fundsWithdrawalRequest.id },
    });

    await data.queryRunner.manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.minus(
        data.createRequestDto.fundsWithdrawalRequest.amount,
      ),
    });

    return data.queryRunner.manager.save(RequestEntity, {
      customer: { id: data.userId },
      customerComment: data.createRequestDto.customerComment,
      requestType: data.createRequestDto.requestType,
      fundsWithdrawalRequest: { id: fundsWithdrawalRequest.id },
    });
  }

  async approveRequest(
    data: ApproveRequestStrategyDto,
  ): Promise<RequestEntity> {
    let fundsWithdrawalReceipt!: FileEntity;
    try {
      const user = await data.queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: data.userId },
      });

      const ability = this.caslAbilityFactory.createForUser(user);

      const request = await data.queryRunner.manager.findOneOrFail(
        RequestEntity,
        {
          where: { number: data.requestNumber },
          relations: ['fundsWithdrawalRequest'],
        },
      );

      if (
        ability.cannot(Action.Approve, request) ||
        ability.cannot(Action.Approve, request.fundsWithdrawalRequest!)
      ) {
        throw new ForbiddenException(
          'У вас немає прав для оновлення цього запиту або запит вже був закритий',
        );
      }

      if (!data.document) {
        throw new BadRequestException(
          'Необхідно завантажити файл підтвердження відправки коштів',
        );
      }

      fundsWithdrawalReceipt = await this.filesService.uploadFile(
        data.queryRunner,
        data.document,
        {
          folder: Folder.FundsWithdrawRequestFiles,
        },
      );

      await data.queryRunner.manager.save(FundsWithdrawRequestEntity, {
        id: request.fundsWithdrawalRequest!.id,
        status: FundsWithdrawRequestStatus.Approved,
        fundsWithdrawalReceipt: { id: fundsWithdrawalReceipt.id },
      });

      await data.queryRunner.manager.save(RequestEntity, {
        id: request.id,
        managerComment: data.approveRequestDto.managerComment,
      });

      return await data.queryRunner.manager.findOneOrFail(RequestEntity, {
        where: { number: data.requestNumber },
        relations: ['fundsWithdrawalRequest'],
      });
    } catch (error) {
      if (fundsWithdrawalReceipt) {
        await this.filesService.deleteFilesCloudinary([fundsWithdrawalReceipt]);
      }
      throw new BadRequestException(error.message);
    }
  }

  async rejectRequest(data: RejectRequestStrategyDto): Promise<RequestEntity> {
    let document!: FileEntity;
    try {
      const user = await data.queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: data.userId },
      });

      const ability = this.caslAbilityFactory.createForUser(user);

      const request = await data.queryRunner.manager.findOneOrFail(
        RequestEntity,
        {
          where: { number: data.requestNumber },
          relations: ['fundsWithdrawalRequest', 'customer'],
        },
      );

      if (
        ability.cannot(Action.Decline, request) ||
        ability.cannot(Action.Decline, request.fundsWithdrawalRequest!)
      ) {
        throw new ForbiddenException(
          'У вас немає прав для оновлення цього запиту або запит вже був закритий',
        );
      }

      if (!data.rejectRequestDto.managerComment) {
        throw new BadRequestException(
          'Необхідно вказати причину відхилення заявки',
        );
      }

      if (data.document) {
        document = await this.filesService.uploadFile(
          data.queryRunner,
          data.document,
          {
            folder: Folder.FundsWithdrawRequestFiles,
          },
        );
      }

      const balance = await data.queryRunner.manager.findOneOrFail(
        BalanceEntity,
        {
          where: { owner: { id: request.customer.id } },
        },
      );

      await data.queryRunner.manager.save(PaymentTransactionEntity, {
        amount: request.fundsWithdrawalRequest!.amount,
        status: TransactionStatus.Success,
        balance: { id: balance.id },
        fundsWithdrawalRequest: { id: request.fundsWithdrawalRequest!.id },
      });

      await data.queryRunner.manager.save(BalanceEntity, {
        id: balance.id,
        amount: balance.amount.plus(request.fundsWithdrawalRequest!.amount),
      });

      await data.queryRunner.manager.save(FundsWithdrawRequestEntity, {
        id: request.fundsWithdrawalRequest!.id,
        status: FundsWithdrawRequestStatus.Declined,
        fundsWithdrawalReceipt: { id: document?.id },
      });

      await data.queryRunner.manager.save(RequestEntity, {
        id: request.id,
        managerComment: data.rejectRequestDto.managerComment,
      });

      return await data.queryRunner.manager.findOneOrFail(RequestEntity, {
        where: { number: data.requestNumber },
        relations: ['fundsWithdrawalRequest'],
      });
    } catch (error) {
      if (document) {
        await this.filesService.deleteFilesCloudinary([document]);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateRequestByCustomer(
    _data: UpdateRequestByCustomerContextDto,
  ): Promise<RequestEntity> {
    return Promise.resolve() as any;
  }
}
