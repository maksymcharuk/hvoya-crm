export interface DepositFundsDtoData {
  companyId?: string;
  userId: string;
  amount: number;
  createdAt: Date; // '2023-05-29T11:22:56'
}

export class DepositFundsDto {
  id_company?: string;
  id_counterparty: string;
  amount: number;
  date: string; // '2023-05-29T11:22:56'

  constructor(data: DepositFundsDtoData) {
    this.id_company = data.companyId;
    this.id_counterparty = data.userId;
    this.amount = data.amount;
    this.date = data.createdAt.toISOString();
  }
}
