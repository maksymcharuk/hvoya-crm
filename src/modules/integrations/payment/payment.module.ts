import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { PrivatBankModule } from './privat-bank/privat-bank.module';

const routes = [
  {
    path: 'payment',
    children: [
      {
        path: 'privat-bank',
        module: PrivatBankModule,
      },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes), PrivatBankModule],
})
export class PaymentModule {}
