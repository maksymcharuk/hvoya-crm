import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsTransferService {
  constructor(private http: HttpClient) {}

  importProducts(transferData: FormData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/products-transfer/import`,
      transferData,
    );
  }
}
