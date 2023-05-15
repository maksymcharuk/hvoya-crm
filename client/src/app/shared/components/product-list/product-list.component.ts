import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  ProductBase,
  ProductCategory,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';
import { CartItem } from '@shared/interfaces/entities/cart.entity';
import { ProductsService } from '@shared/services/products.service';
import { SortingOrder } from '@shared/enums/sorting-order.enum';

import { MessageService } from 'primeng/api';

import { combineLatest, debounceTime, distinctUntilChanged, Subject, switchMap, take, BehaviorSubject } from 'rxjs';

import { ProductColorsService } from '../../../modules/admin/modules/products/services/product-colors.service';
import { ProductSizesService } from '../../../modules/admin/modules/products/services/product-sizes.service';
import { CartService } from '../../../modules/dashboard/modules/cart/services/cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @Input() hideAddToCartButton = false;

  productList$ = new BehaviorSubject<ProductBase[]>([]);

  productList: ProductBase[] = [];
  sortOptions = [
    { value: { id: 1, orderBy: 'name', order: SortingOrder.DESC }, label: 'Назва (А-Я)' },
    { value: { id: 2, orderBy: 'name', order: SortingOrder.ASC }, label: 'Назва (Я-А)' },
    { value: { id: 3, orderBy: 'price', order: SortingOrder.DESC }, label: 'Ціна найдорожче' },
    { value: { id: 4, orderBy: 'price', order: SortingOrder.ASC }, label: 'Ціна найдешевше' },
  ];
  sortValue: any = null;
  filterList: any[] = [];
  selectedFilters: any[] = [];
  lastQueryParams!: Params;
  searchKeyValue: string = '';
  searchValueUpdate$ = new Subject<string>();
  page = 1;

  constructor(
    private productSizesService: ProductSizesService,
    private productColorsService: ProductColorsService,
    private router: Router,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private messageService: MessageService,
  ) {
    this.searchValueUpdate$.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.onSearchFilter(value);
      });


    this.productsService.productsList$.subscribe((products) => {
      if (this.page === 1) {
        this.productList$.next(products);
      } else {
        this.productList$.next(this.productList$.getValue().concat(products));
      }
    });
  }

  ngOnInit() {
    this.getSizesList();
    this.getColorsList();
    this.getCategoryList();

    this.route.queryParams.subscribe((params: any) => {
      this.productsService.getFilteredProducts(params, this.page).subscribe();
      this.lastQueryParams = params;

      this.setSortValue(params);
      this.setFilterValue(params);
      this.setSearchKeyValue(params);
    });
  }

  onAddToCart(productVariant: ProductVariant) {
    combineLatest([this.cartService.cart$])
      .pipe(
        take(1),
        switchMap(([cart]) => {
          const selectedVariantCount = cart?.items.find(
            (item: CartItem) => item.product.id === productVariant.id,
          )?.quantity;
          if (!productVariant) {
            this.messageService.add({
              severity: 'error',
              detail: `Can't add to cart`,
            });
            throw new Error("Can't add to cart");
          }
          return this.cartService.addToCart({
            productId: productVariant.id,
            quantity: selectedVariantCount ? selectedVariantCount + 1 : 1,
          });
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          detail: `${productVariant.properties.name} added to cart`,
        });
      });
  }

  onSortChange(event: any) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { orderBy: event.value.orderBy, order: event.value.order },
        queryParamsHandling: 'merge',
      });
    this.page = 1;
  }

  onFilter(event: any) {
    const queryParamsObject = {} as any;
    event.value.forEach((param: any) => {
      const key = Object.keys(param.value)[0];
      const value = param.value[key!].toString();

      if (queryParamsObject[key!]) {
        queryParamsObject[key!] += `,${value}`;
      } else {
        queryParamsObject[key!] = value;
      }
    });

    Object.keys(this.lastQueryParams).forEach(key => {
      if (!queryParamsObject[key] && key !== 'orderBy' && key !== 'order' && key !== 'search') {
        queryParamsObject[key] = null;
      }
    });

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParamsObject,
        queryParamsHandling: 'merge',
      });

    this.page = 1;
  }

  onSearchFilter(searchKeyValue: string) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { searchKey: searchKeyValue || null },
        queryParamsHandling: 'merge',
      });

    this.page = 1;
  }

  onScroll() {
    this.page++;
    this.productsService.getFilteredProducts(this.lastQueryParams, this.page).subscribe();
  }

  private getColorsList() {
    this.productColorsService.getAllColors().subscribe((colors) => {
      let allColors = {
        label: 'Колір',
        value: 'color',
        items: colors.map((color) => {
          return {
            label: color.name,
            value: { color: color.id },
            uuid: `color-${color.id}`
          };
        })
      }

      this.filterList = [...this.filterList, allColors]
    });
  }

  private getSizesList() {
    this.productSizesService.getAllSizes().subscribe((sizes) => {
      let allSizes = {
        label: 'Розмір',
        value: 'size',
        items: sizes.map((size) => {
          return {
            label: `${size.width != 0 ? 'Ширина:' + size.width : ''}
              ${size.height != 0 ? 'Висота:' + size.height : ''}
              ${size.diameter != 0 ? 'Діаметр:' + size.diameter : ''}`,
            value: { size: size.id },
            uuid: `size-${size.id}`
          };
        })
      }

      this.filterList = [...this.filterList, allSizes]
    });
  }

  private getCategoryList() {
    this.productsService.getProductsCategories().subscribe((categories: ProductCategory[]) => {

      let allCategories = {
        label: 'Категорія',
        value: 'category',
        items: categories.map((category) => {
          return {
            label: category.name,
            value: { category: category.id },
            uuid: `category-${category.id}`
          };
        })
      };

      this.filterList = [...this.filterList, allCategories];
    })
  }

  private setSortValue(params: any) {
    this.sortValue = this.sortOptions.find((option) => {
      if (!params.orderBy || !params.order) {
        return;
      }
      return option.value.orderBy === params.orderBy && option.value.order === params.order
    })?.value || null;
  }

  private setFilterValue(params: any) {
    if (!params.category && !params.color && !params.size) {
      return;
    }

    this.selectedFilters = Object.entries(params)
      .filter(([key]) => key !== 'searchKey' && key !== 'order' && key !== 'orderBy')
      .flatMap(([key, value]: any) => value.split(',').map((v: any) => ({ value: { [key]: v }, uuid: `${key}-${v}` })));
  }

  private setSearchKeyValue(params: any) {
    this.searchKeyValue = params.searchKey || '';
  }
}
