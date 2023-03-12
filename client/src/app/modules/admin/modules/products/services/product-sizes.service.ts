import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateProductSizeDTO } from '@shared/interfaces/dto/create-product-size.dto';
import { ProductSize } from '@shared/interfaces/products';

@Injectable({
  providedIn: 'root',
})
export class ProductSizesService {
  constructor(private readonly http: HttpClient) {}

  getSizeById(id: number): Observable<ProductSize> {
    return this.http.get<ProductSize>(
      `${environment.apiUrl}/product-sizes/${id}`,
    );
  }

  getAllSizes(): Observable<ProductSize[]> {
    return this.http.get<ProductSize[]>(`${environment.apiUrl}/product-sizes`);
  }

  createSize(
    createProductSizeDTO: CreateProductSizeDTO,
  ): Observable<ProductSize> {
    return this.http.post<ProductSize>(
      `${environment.apiUrl}/product-sizes`,
      createProductSizeDTO,
    );
  }

  updateSize(
    id: number,
    updateProductSizeDTO: Partial<CreateProductSizeDTO>,
  ): Observable<ProductSize> {
    return this.http.put<ProductSize>(
      `${environment.apiUrl}/product-sizes/${id}`,
      updateProductSizeDTO,
    );
  }
}
