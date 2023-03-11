import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateProductColorDTO } from '@shared/interfaces/dto/create-product-color.dto';
import { ProductColor } from '@shared/interfaces/products';

@Injectable({
  providedIn: 'root',
})
export class ProductColorsService {
  constructor(private readonly http: HttpClient) {}

  getColorById(id: number): Observable<ProductColor> {
    return this.http.get<ProductColor>(
      `${environment.apiUrl}/product-colors/${id}`,
    );
  }

  getAllColors(): Observable<ProductColor[]> {
    return this.http.get<ProductColor[]>(
      `${environment.apiUrl}/product-colors`,
    );
  }

  createColor(
    createProductColorDTO: CreateProductColorDTO,
  ): Observable<ProductColor> {
    return this.http.post<ProductColor>(
      `${environment.apiUrl}/product-colors`,
      createProductColorDTO,
    );
  }

  updateColor(
    id: number,
    updateProductColorDTO: Partial<CreateProductColorDTO>,
  ): Observable<ProductColor> {
    return this.http.put<ProductColor>(
      `${environment.apiUrl}/product-colors/${id}`,
      updateProductColorDTO,
    );
  }
}
