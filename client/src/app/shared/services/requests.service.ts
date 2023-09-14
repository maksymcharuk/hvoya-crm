import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient) {}

  getRequests(pageOptions: PageOptions): Observable<Page<RequestEntity>> {
    let params = new HttpParams({ fromObject: pageOptions.toParams() });

    return this.http
      .get<Page<RequestEntity>>(`${environment.apiUrl}/requests`, {
        params,
      })
      .pipe(
        map((requests) => ({
          data: requests.data.map((request) => new RequestEntity(request)),
          meta: requests.meta,
        })),
      );
  }

  getRequest(number: string): Observable<RequestEntity> {
    return this.http
      .get<RequestEntity>(`${environment.apiUrl}/requests/${number}`)
      .pipe(map((request) => new RequestEntity(request)));
  }

  createRequest(requestCreateFormData: FormData): Observable<RequestEntity> {
    return this.http
      .post<RequestEntity>(
        `${environment.apiUrl}/requests`,
        requestCreateFormData,
      )
      .pipe(map((request) => new RequestEntity(request)));
  }

  requestUpdateByCustomer(
    requestNumber: string,
    requestUpdateFormData: FormData,
  ): Observable<RequestEntity> {
    return this.http
      .put<RequestEntity>(
        `${environment.apiUrl}/requests/${requestNumber}/update-by-customer`,
        requestUpdateFormData,
      )
      .pipe(map((request) => new RequestEntity(request)));
  }

  approveRequest(
    requestApproveFormData: FormData,
    requestNumber: number,
  ): Observable<RequestEntity> {
    return this.http
      .put<RequestEntity>(
        `${environment.apiUrl}/requests/${requestNumber}/approve`,
        requestApproveFormData,
      )
      .pipe(map((request) => new RequestEntity(request)));
  }

  rejectRequest(
    requestRejectFormData: FormData,
    requestNumber: number,
  ): Observable<RequestEntity> {
    return this.http
      .put<RequestEntity>(
        `${environment.apiUrl}/requests/${requestNumber}/reject`,
        requestRejectFormData,
      )
      .pipe(map((request) => new RequestEntity(request)));
  }
}
