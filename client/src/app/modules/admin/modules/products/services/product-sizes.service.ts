import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateProductSizeDTO } from '@shared/interfaces/dto/create-product-size.dto';
import { ProductSize } from '@shared/interfaces/entities/product.entity';

@Injectable({
  providedIn: 'root',
})
export class ProductSizesService {
  constructor(private readonly http: HttpClient) {}

  getSizeById(id: string): Observable<ProductSize> {
    return this.http
      .get<ProductSize>(`${environment.apiUrl}/product-sizes/${id}`)
      .pipe(map((productSize) => new ProductSize(productSize)));
  }

  getAllSizes(): Observable<ProductSize[]> {
    return this.http
      .get<ProductSize[]>(`${environment.apiUrl}/product-sizes`)
      .pipe(
        map((productSizeList) =>
          productSizeList.map((productSize) => new ProductSize(productSize)),
        ),
      );
  }

  createSize(
    createProductSizeDTO: CreateProductSizeDTO,
  ): Observable<ProductSize> {
    return this.http
      .post<ProductSize>(
        `${environment.apiUrl}/product-sizes`,
        createProductSizeDTO,
      )
      .pipe(map((productSize) => new ProductSize(productSize)));
  }

  updateSize(
    id: string,
    updateProductSizeDTO: Partial<CreateProductSizeDTO>,
  ): Observable<ProductSize> {
    return this.http
      .put<ProductSize>(
        `${environment.apiUrl}/product-sizes/${id}`,
        updateProductSizeDTO,
      )
      .pipe(map((productSize) => new ProductSize(productSize)));
  }
}
