import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateProductColorDTO } from '@shared/interfaces/dto/create-product-color.dto';
import { ProductColor } from '@shared/interfaces/entities/product.entity';

@Injectable({
  providedIn: 'root',
})
export class ProductColorsService {
  constructor(private readonly http: HttpClient) {}

  getColorById(id: string): Observable<ProductColor> {
    return this.http
      .get<ProductColor>(`${environment.apiUrl}/product-colors/${id}`)
      .pipe(map((productColor) => new ProductColor(productColor)));
  }

  getAllColors(): Observable<ProductColor[]> {
    return this.http
      .get<ProductColor[]>(`${environment.apiUrl}/product-colors`)
      .pipe(
        map((productColorList) =>
          productColorList.map(
            (productColor) => new ProductColor(productColor),
          ),
        ),
      );
  }

  createColor(
    createProductColorDTO: CreateProductColorDTO,
  ): Observable<ProductColor> {
    return this.http
      .post<ProductColor>(
        `${environment.apiUrl}/product-colors`,
        createProductColorDTO,
      )
      .pipe(map((productColor) => new ProductColor(productColor)));
  }

  updateColor(
    id: string,
    updateProductColorDTO: Partial<CreateProductColorDTO>,
  ): Observable<ProductColor> {
    return this.http
      .put<ProductColor>(
        `${environment.apiUrl}/product-colors/${id}`,
        updateProductColorDTO,
      )
      .pipe(map((productColor) => new ProductColor(productColor)));
  }
}
