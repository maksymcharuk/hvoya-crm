import { MessageService } from 'primeng/api';
import {
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  scan,
  skip,
  switchMap,
  take,
  takeUntil,
  tap,
  zip,
} from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

// import { SortOrder } from '@shared/enums/sort-order.enum';
import { CartItem } from '@shared/interfaces/entities/cart.entity';
import {
  ProductBase,
  ProductCategory,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';
import { ProductsService } from '@shared/services/products.service';

import { ProductColorsService } from '../../../modules/admin/modules/products/services/product-colors.service';
import { ProductSizesService } from '../../../modules/admin/modules/products/services/product-sizes.service';
import { CartService } from '../../../modules/dashboard/modules/cart/services/cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnDestroy {
  @Input() hideAddToCartButton = false;

  productList$ = this.productsService.productsList$.pipe(
    scan((acc: ProductBase[], value: ProductBase[]) => {
      if (this.page > 1) {
        return acc.concat(value);
      }
      return value;
    }, []),
  );
  private readonly destroyed$ = new Subject<void>();

  // sortOptions = [
  //   {
  //     value: { id: 1, orderBy: 'name', order: SortOrder.DESC },
  //     label: 'Назва (А-Я)',
  //   },
  //   {
  //     value: { id: 2, orderBy: 'name', order: SortOrder.ASC },
  //     label: 'Назва (Я-А)',
  //   },
  //   {
  //     value: { id: 3, orderBy: 'price', order: SortOrder.DESC },
  //     label: 'Ціна найдорожче',
  //   },
  //   {
  //     value: { id: 4, orderBy: 'price', order: SortOrder.ASC },
  //     label: 'Ціна найдешевше',
  //   },
  // ];

  filtersForm = this.fb.group({
    // sort: [this.sortOptions[0]],
    filters: [[]],
    search: [''],
    stock: [false],
  });

  // get sortControl(): AbstractControl {
  //   return this.filtersForm.get('sort')!;
  // }

  get filtersControl(): AbstractControl {
    return this.filtersForm.get('filters')!;
  }

  get searchControl(): AbstractControl {
    return this.filtersForm.get('search')!;
  }

  get stockControl(): AbstractControl {
    return this.filtersForm.get('stock')!;
  }

  filterOptions$ = zip([
    this.getCategoryList(),
    this.getSizesList(),
    this.getColorsList(),
  ]);
  selectedFilterOptions: any[] = [];

  lastQueryParams!: Params;

  page = 1;
  showSkeletonLoading = true;
  showMoreLoader = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cartService: CartService,
    private productsService: ProductsService,
    private productSizesService: ProductSizesService,
    private productColorsService: ProductColorsService,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.productsService
        .getFilteredProducts(params, this.page)
        .pipe(takeUntil(this.destroyed$))
        .subscribe();
      this.lastQueryParams = params;

      // this.setSelectedSortOption(params);
      this.setFilterValue(params);
      this.setSearchQuery(params);
      this.setInStockValue(params.inStockOnly);
    });

    this.productList$
      .pipe(takeUntil(this.destroyed$), skip(1))
      .subscribe(() => {
        this.showSkeletonLoading = false;
      });

    // this.sortControl.valueChanges
    //   .pipe(debounceTime(400), distinctUntilChanged())
    //   .subscribe((value) => {
    //     this.onSortChange(value);
    //   });
    this.filtersControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.onFilter(value);
      });
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.onSearchFilter(value);
      });
    this.stockControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.onStockFilter(value);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
          detail: `${productVariant.properties.name} додано в кошик`,
        });
      });
  }

  // onSortChange(value: any) {
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: { orderBy: value.orderBy, order: value.order },
  //     queryParamsHandling: 'merge',
  //   });
  //   this.page = 1;
  // }

  onFilter(value: any) {
    this.showSkeletonLoading = true;

    const queryParamsObject = {} as any;
    value.forEach((param: any) => {
      const key = Object.keys(param.value)[0];
      const value = param.value[key!].toString();

      if (queryParamsObject[key!]) {
        queryParamsObject[key!] += `,${value}`;
      } else {
        queryParamsObject[key!] = value;
      }
    });

    Object.keys(this.lastQueryParams).forEach((key) => {
      if (
        !queryParamsObject[key] &&
        key !== 'orderBy' &&
        key !== 'order' &&
        key !== 'search' &&
        key !== 'inStockOnly'
      ) {
        queryParamsObject[key] = null;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParamsObject,
      queryParamsHandling: 'merge',
    });

    this.page = 1;
  }

  onSearchFilter(searchQuery: string) {
    this.showSkeletonLoading = true;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { searchQuery: searchQuery || null },
      queryParamsHandling: 'merge',
    });

    this.page = 1;
  }

  onStockFilter(inStock: boolean) {
    this.showSkeletonLoading = true;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { inStockOnly: inStock || null },
      queryParamsHandling: 'merge',
    });

    this.page = 1;
  }

  setInStockValue(isInStock: boolean) {
    this.stockControl.patchValue(!!isInStock, {
      emitEvent: false,
    });
  }

  onScroll() {
    this.page++;
    this.showMoreLoader = true;
    this.productsService
      .getFilteredProducts(this.lastQueryParams, this.page)
      .pipe(tap(() => (this.showMoreLoader = false)))
      .subscribe();
  }

  private getColorsList() {
    return this.productColorsService.getAllColors().pipe(
      map((colors) => ({
        label: 'Колір',
        value: 'color',
        items: colors
          .map((color) => {
            return {
              label: color.name,
              value: { color: color.id },
              uuid: `color-${color.id}`,
            };
          })
          .sort((a, b) => a.label!.localeCompare(b.label!)),
      })),
    );
  }

  private getSizesList() {
    return this.productSizesService.getAllSizes().pipe(
      map((sizes) => {
        const uHeights = new Set(
          sizes
            .map((size) => size.height)
            .filter((value) => !!value)
            .sort((a, b) => a - b),
        );
        const uDiameters = new Set(
          sizes
            .map((size) => size.diameter)
            .filter((value) => !!value)
            .sort((a, b) => a - b),
        );

        const heights = Array.from(uHeights).map((height) => {
          return {
            label: `Висота: ${height} см`,
            value: { height },
            uuid: `height-${height}`,
          };
        });
        const diameters = Array.from(uDiameters).map((diameter) => {
          return {
            label: `Діаметр: ${diameter} см`,
            value: { diameter },
            uuid: `diameter-${diameter}`,
          };
        });

        return {
          label: 'Розмір',
          value: 'size',
          items: [...heights, ...diameters],
        };
      }),
    );
  }

  private getCategoryList() {
    return this.productsService.getProductsCategories().pipe(
      map((categories: ProductCategory[]) => ({
        label: 'Категорія',
        value: 'category',
        items: categories
          .map((category) => {
            return {
              label: category.name,
              value: { category: category.id },
              uuid: `category-${category.id}`,
            };
          })
          .sort((a, b) => a.label!.localeCompare(b.label!)),
      })),
    );
  }

  // private setSelectedSortOption(params: any) {
  //   const selectedSortOption =
  //     this.sortOptions.find((option) => {
  //       if (!params.orderBy || !params.order) {
  //         return;
  //       }
  //       return (
  //         option.value.orderBy === params.orderBy &&
  //         option.value.order === params.order
  //       );
  //     })?.value || null;

  //   this.sortControl.patchValue(selectedSortOption);
  // }

  private setFilterValue(params: any) {
    if (
      !params.category &&
      !params.color &&
      !params.height &&
      !params.diameter
    ) {
      return;
    }

    const selectedFilterOptions = Object.entries(params)
      .filter(
        ([key]) =>
          key !== 'searchQuery' &&
          key !== 'order' &&
          key !== 'orderBy' &&
          key !== 'inStockOnly',
      )
      .flatMap(([key, value]: any) =>
        value
          .split(',')
          .map((v: any) => ({ value: { [key]: v }, uuid: `${key}-${v}` })),
      );

    this.filtersControl.patchValue(selectedFilterOptions, { emitEvent: false });
  }

  private setSearchQuery(params: any) {
    this.searchControl.patchValue(params.searchQuery || '', {
      emitEvent: false,
    });
  }
}
