import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { GetProductsForCreationResponse, GetProductsResponse } from '@shared/interfaces/responses/get-products.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) { }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/products`, product);
  }

  getProducts(): Observable<GetProductsResponse> {
    return this.http.get<GetProductsResponse>(`${environment.apiUrl}/products`);
  }

  getProductsForCreation(): Observable<GetProductsForCreationResponse> {
    return this.http.get<GetProductsForCreationResponse>(`${environment.apiUrl}/products/base`);
  }
}
