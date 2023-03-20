import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import {
  ProductBase,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  createProduct(product: FormData): Observable<ProductVariant> {
    return this.http
      .post<ProductVariant>(`${environment.apiUrl}/products`, product)
      .pipe(map((product) => new ProductVariant(product)));
  }

  getProducts(): Observable<ProductBase[]> {
    return this.http
      .get<ProductBase[]>(`${environment.apiUrl}/products`)
      .pipe(
        map((products) => products.map((product) => new ProductBase(product))),
      );
  }

  getProduct(id: number): Observable<ProductBase> {
    return this.http
      .get<ProductBase>(`${environment.apiUrl}/products/${id}`)
      .pipe(map((product) => new ProductBase(product)));
  }

  editProduct(product: FormData): Observable<ProductVariant> {
    return this.http
      .put<ProductVariant>(`${environment.apiUrl}/products`, product)
      .pipe(map((product) => new ProductVariant(product)));
  }
}
