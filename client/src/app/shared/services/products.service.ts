import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { GetProductsResponse } from '@shared/interfaces/responses/get-products.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(`${environment.apiUrl}/products`);
  }
}
