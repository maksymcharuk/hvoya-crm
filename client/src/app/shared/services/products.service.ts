import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { GetProductResponse } from '@shared/interfaces/responses/get-product.response';
import { GetProductsResponse } from '@shared/interfaces/responses/get-products.response';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  createProduct(product: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/products`, product);
  }

  getProducts(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(`${environment.apiUrl}/products`);
  }

  getProduct(id: number): Observable<GetProductResponse> {
    return this.http.get<GetProductResponse>(
      `${environment.apiUrl}/products/${id}`,
    );
  }

  editProduct(product: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}/products`, product);
  }
}
