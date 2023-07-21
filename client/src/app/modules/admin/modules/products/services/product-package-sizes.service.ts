import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreateProductPackageSizeDTO } from '@shared/interfaces/dto/create-product-package-size.dto';
import { ProductPackageSize } from '@shared/interfaces/entities/product.entity';

@Injectable({
  providedIn: 'root',
})
export class ProductPackageSizesService {
  constructor(private readonly http: HttpClient) {}

  getSizeById(id: string): Observable<ProductPackageSize> {
    return this.http
      .get<ProductPackageSize>(
        `${environment.apiUrl}/product-package-sizes/${id}`,
      )
      .pipe(
        map((productPackageSize) => new ProductPackageSize(productPackageSize)),
      );
  }

  getAllSizes(): Observable<ProductPackageSize[]> {
    return this.http
      .get<ProductPackageSize[]>(`${environment.apiUrl}/product-package-sizes`)
      .pipe(
        map((productPackageSizeList) =>
          productPackageSizeList.map(
            (productPackageSize) => new ProductPackageSize(productPackageSize),
          ),
        ),
      );
  }

  createSize(
    createProductPackageSizeDTO: CreateProductPackageSizeDTO,
  ): Observable<ProductPackageSize> {
    return this.http
      .post<ProductPackageSize>(
        `${environment.apiUrl}/product-package-sizes`,
        createProductPackageSizeDTO,
      )
      .pipe(
        map((productPackageSize) => new ProductPackageSize(productPackageSize)),
      );
  }

  updateSize(
    id: string,
    updateProductPackageSizeDTO: Partial<CreateProductPackageSizeDTO>,
  ): Observable<ProductPackageSize> {
    return this.http
      .put<ProductPackageSize>(
        `${environment.apiUrl}/product-package-sizes/${id}`,
        updateProductPackageSizeDTO,
      )
      .pipe(
        map((productPackageSize) => new ProductPackageSize(productPackageSize)),
      );
  }
}
