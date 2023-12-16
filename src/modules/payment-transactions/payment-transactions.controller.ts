import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { User } from '@decorators/user.decorator';
import { PaymentTransactionsPageOptionsDto } from '@dtos/payment-transactions-page-options.dto';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '../casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { PaymentTransactionsService } from './services/payment-transactions.service';

@Controller('payment-transactions')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class PaymentTransactionsController {
  constructor(private paymentTransactionsService: PaymentTransactionsService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, PaymentTransactionEntity),
  )
  async getPaymentTransactions(
    @User('id') userId: string,
    @Query()
    paymentTransactionsPageOptionsDto: PaymentTransactionsPageOptionsDto,
  ): Promise<Page<PaymentTransactionEntity>> {
    return this.paymentTransactionsService.getPaymentTransactions(
      userId,
      paymentTransactionsPageOptionsDto,
    );
  }
}
