import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import * as data from './products.data';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private products = data.default;

  getProducts(): Observable<any> {
    return of(this.products).pipe(delay(2000));
  }
}
