export interface RefundsDtoData {
  companyId?: string;
  userId: string;
  amount: number;
  createdAt: Date;
}

export class RefundsDto {
  id_company?: string;
  id_counterparty: string;
  amount: number;
  date: string; // '2023-05-29T13:49:28'

  constructor(data: RefundsDtoData) {
    this.id_company = data.companyId;
    this.id_counterparty = data.userId;
    this.amount = data.amount;
    this.date = data.createdAt.toISOString();
  }
}
