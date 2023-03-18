import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateFaqDTO } from '@shared/interfaces/dto/create-faq.dto';
import { UpdateFaqDTO } from '@shared/interfaces/dto/update-faq.dto';
import { Faq } from '@shared/interfaces/faq.interface';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${environment.apiUrl}/faq`);
  }

  findById(id: number): Observable<Faq> {
    return this.http.get<Faq>(`${environment.apiUrl}/faq/${id}`);
  }

  create(faq: CreateFaqDTO): Observable<Faq> {
    return this.http.post<Faq>(`${environment.apiUrl}/faq`, faq);
  }

  update(id: number, faq: UpdateFaqDTO): Observable<Faq> {
    return this.http.put<Faq>(`${environment.apiUrl}/faq/${id}`, faq);
  }

  updateBatch(faqList: UpdateFaqDTO[]): Observable<Faq[]> {
    return this.http.put<Faq[]>(`${environment.apiUrl}/faq`, faqList);
  }

  delete(id: number): Observable<Faq> {
    return this.http.delete<Faq>(`${environment.apiUrl}/faq/${id}`);
  }
}
