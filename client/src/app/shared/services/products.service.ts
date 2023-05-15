import { Observable, map, BehaviorSubject, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { environment } from '@environment/environment';
import {
  ProductBase,
  ProductCategory,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';
import { PageDto } from '@shared/interfaces/dto/page.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) { }

  productsList$ = new BehaviorSubject<ProductBase[]>([]);

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
        tap((products) => this.productsList$.next(products))
      );
  }

  getProductsCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<ProductCategory[]>(`${environment.apiUrl}/products/categories`)
      .pipe(
        map((categories) => categories.map((category) => new ProductCategory(category)))
      );
  }

  getFilteredProducts(filter: Params, page: number): Observable<ProductBase[]> {
    return this.http
      .get<PageDto<ProductBase[]>>(`${environment.apiUrl}/products/filtered`, { params: { ...filter, page } })
      .pipe(
        map((products) => products.data.map((product) => new ProductBase(product))),
        tap((products) => this.productsList$.next(products))
      );
  }

  getProduct(id: string): Observable<ProductBase> {
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
