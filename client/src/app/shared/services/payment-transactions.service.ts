import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentTransactionsService {
  constructor(private http: HttpClient) {}

  getPaymentTransactions(
    pageOptions?: PageOptions,
  ): Observable<Page<PaymentTransaction>> {
    let params = new HttpParams({ fromObject: pageOptions?.toParams() });

    return this.http
      .get<Page<PaymentTransaction>>(
        `${environment.apiUrl}/payment-transactions`,
        {
          params,
        },
      )
      .pipe(
        map((paymentTransaction) => ({
          data: paymentTransaction.data.map(
            (paymentTransaction) => new PaymentTransaction(paymentTransaction),
          ),
          meta: paymentTransaction.meta,
        })),
      );
  }
}
