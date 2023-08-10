import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@environment/environment';

import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { ApproveReturnRequestDTO } from '@shared/interfaces/dto/approve-request.dto';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private http: HttpClient) { }

  getRequests(): Observable<RequestEntity[]> {
    return this.http
      .get<RequestEntity[]>(`${environment.apiUrl}/request`)
      .pipe(map((requests) => requests.map((request) => new RequestEntity(request))));
  }

  getRequest(number: string): Observable<RequestEntity> {
    return this.http
      .get<RequestEntity>(`${environment.apiUrl}/request/${number}`)
      .pipe(map((request) => new RequestEntity(request)));
  }

  createRequest(requestCreateFormData: FormData): Observable<RequestEntity> {
    return this.http
      .post<RequestEntity>(`${environment.apiUrl}/request`, requestCreateFormData)
      .pipe(map((request) => new RequestEntity(request)));
  }

  requestUpdateByCustomer(requestNumber: string, requestUpdateFormData: FormData): Observable<RequestEntity> {
    return this.http
      .put<RequestEntity>(`${environment.apiUrl}/request/${requestNumber}/update-by-customer`, requestUpdateFormData)
      .pipe(map((request) => new RequestEntity(request)));
  }

  approveRequest(requestApproveFormData: ApproveReturnRequestDTO, requestNumber: number): Observable<RequestEntity> {
    return this.http
      .post<RequestEntity>(`${environment.apiUrl}/return-request/approve/${requestNumber}`, requestApproveFormData)
      .pipe(map((request) => new RequestEntity(request)));
  }
}
