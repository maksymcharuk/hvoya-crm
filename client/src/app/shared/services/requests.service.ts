import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { ApproveReturnRequestDTO } from '@shared/interfaces/dto/approve-request.dto';
import { RejectReturnRequestDTO } from '@shared/interfaces/dto/reject-request.dto';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient) {}

  getRequests(): Observable<RequestEntity[]> {
    return this.http
      .get<RequestEntity[]>(`${environment.apiUrl}/requests`)
      .pipe(
        map((requests) =>
          requests.map((request) => new RequestEntity(request)),
        ),
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
    requestApproveFormData: ApproveReturnRequestDTO,
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
    requestRejectFormData: RejectReturnRequestDTO,
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
