import { MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { Subject, catchError, debounceTime, switchMap, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FileFormat } from '@shared/enums/file-format.enum';
import { TransactionStatus } from '@shared/enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@shared/enums/transaction-sync-one-c-status.enum';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { DownloadService } from '@shared/services/download.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent implements OnDestroy {
  @Input() set paymentTransactions(
    paymentTransactions: Page<PaymentTransaction> | null,
  ) {
    this.paymentTransactionsInternal = paymentTransactions;
    if (paymentTransactions) {
      this.loading = false;
    }
  }
  @ViewChild('transactionsTable') transactionsTable!: Table;
  @Output() onLoadData = new EventEmitter<PageOptions>();

  transactions: PaymentTransaction[] = [];
  searchForm = this.fb.group({
    search: [''],
  });
  transactionStatus = TransactionStatus;
  transactionSyncOneCStatus = TransactionSyncOneCStatus;
  loading = true;
  exporting$ = new Subject<boolean>();
  currentUser = this.userService.getUser();
  rows = 20;

  get paymentTransactions(): Page<PaymentTransaction> | null {
    return this.paymentTransactionsInternal;
  }

  private paymentTransactionsInternal: Page<PaymentTransaction> | null = null;
  private destroy$ = new Subject();

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly downloadService: DownloadService,
    private readonly messageService: MessageService,
  ) {
    this.searchControl?.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.transactionsTable.filterGlobal(query, 'contains');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  exportExcel() {
    const userId =
      this.route.snapshot.paramMap.get('id') || this.currentUser?.id;
    this.exporting$.next(true);

    return this.userService
      .exportUserPaymentTransactionsXls(userId as string)
      .pipe(
        switchMap((data) => {
          return this.downloadService.downloadBlob(
            data,
            'Hvoya_CRM_Список_транзакцій.xlsx',
            FileFormat.XLSX,
          );
        }),
        takeUntil(this.destroy$),
        catchError((err) => {
          this.exporting$.next(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося експортувати транзакції',
          });
          throw err;
        }),
      )
      .subscribe(() => {
        this.exporting$.next(false);
        this.messageService.add({
          severity: 'success',
          detail: 'Файл зі списоком транзакцій експортовано',
        });
      });
  }

  navigateToEntity(transaction: PaymentTransaction) {
    // TODO: create URL builder service and move this logic there
    const path = this.currentUser?.isAnyAdmin ? '/admin' : '/dashboard';
    let entityPath: any[] = [];
    if (transaction.order) {
      entityPath = ['orders', transaction.order.number];
    } else if (transaction.orderReturnRequest) {
      entityPath = [
        'requests',
        'return-requests',
        transaction.orderReturnRequest.request?.number,
      ];
    } else if (transaction.fundsWithdrawalRequest) {
      entityPath = [
        'requests',
        'funds-withdrawal-requests',
        transaction.fundsWithdrawalRequest.request?.number,
      ];
    }

    this.router.navigate([path, ...entityPath]);
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    this.loading = true;
    if (this.paymentTransactions) {
      this.paymentTransactions.data = [];
    }
    this.onLoadData.emit(new PageOptions(event));
  }
}
