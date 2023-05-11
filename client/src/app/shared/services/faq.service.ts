import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateFaqDTO } from '@shared/interfaces/dto/create-faq.dto';
import { UpdateFaqDTO } from '@shared/interfaces/dto/update-faq.dto';
import { Faq } from '@shared/interfaces/entities/faq.entity';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Faq[]> {
    return this.http
      .get<Faq[]>(`${environment.apiUrl}/faq`)
      .pipe(map((faqList) => faqList.map((faq) => new Faq(faq))));
  }

  findById(id: string): Observable<Faq> {
    return this.http
      .get<Faq>(`${environment.apiUrl}/faq/${id}`)
      .pipe(map((faq) => new Faq(faq)));
  }

  create(faq: CreateFaqDTO): Observable<Faq> {
    return this.http
      .post<Faq>(`${environment.apiUrl}/faq`, faq)
      .pipe(map((faq) => new Faq(faq)));
  }

  update(id: string, faq: UpdateFaqDTO): Observable<Faq> {
    return this.http
      .put<Faq>(`${environment.apiUrl}/faq/${id}`, faq)
      .pipe(map((faq) => new Faq(faq)));
  }

  updateBatch(faqList: UpdateFaqDTO[]): Observable<Faq[]> {
    return this.http
      .put<Faq[]>(`${environment.apiUrl}/faq`, faqList)
      .pipe(map((faqList) => faqList.map((faq) => new Faq(faq))));
  }

  delete(id: string): Observable<Faq> {
    return this.http
      .delete<Faq>(`${environment.apiUrl}/faq/${id}`)
      .pipe(map((faq) => new Faq(faq)));
  }
}
