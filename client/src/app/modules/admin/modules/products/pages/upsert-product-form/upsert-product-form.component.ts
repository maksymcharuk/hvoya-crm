import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ProductBase, ProductCategory, ProductProperties, ProductVariant } from '@shared/interfaces/products';
import { ProductsService } from '@shared/services/products.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-upsert-product-form',
  templateUrl: './upsert-product-form.component.html',
  styleUrls: ['./upsert-product-form.component.scss']
})
export class UpsertProductFormComponent implements OnInit, OnDestroy {
  emptyProduct = {
    variants: [
      {
        sku: '',
        properties: {
          name: '',
          description: '',
          price: 0,
          size: '',
          color: '',
          images: [],
        } as Partial<ProductProperties>,
      },
    ] as Partial<ProductVariant>[],
  };
  product$: BehaviorSubject<any> = new BehaviorSubject(this.emptyProduct);
  acceptedFiles = '.jpg, .png, .jpeg';
  invalidFileTypeMessage = `Некоректний тип файлу. Дозволено файли тільки таких типів: ${this.acceptedFiles}.`;
  colors: any[] = [{ name: 'red' }, { name: 'green' }, { name: 'blue' }];
  sizes: any[] = [{ name: '1m' }, { name: '1.5m' }, { name: '2m' }];
  isLoading = false;
  allBaseProducts: ProductBase[] = [];
  destroy$: Subject<boolean> = new Subject();
  baseProductsByCategory: ProductBase[] = [];
  productsCategories: ProductCategory[] = [];
  productsList: ProductVariant[] = [];
  previewImagesList: any[] = [];
  selectedProductImages: any = [];
  selectedProductImagesUrls: string[] = [];
  baseProductCategoryChange: any = null;
  productBaseProductChange: any = null;
  productImagesDisabled = true;
  newProductBase = false;
  newCategory = false;

  selectedBaseProduct: ProductBase | undefined = undefined;
  selectedCategory: ProductCategory | undefined = undefined;
  selectedProductVariant: ProductVariant | undefined = undefined;
  selectedProductVariantDefaultBaseProduct!: ProductBase;
  productForm = this.formBuilder.group({
    productCategoryGroup: this.formBuilder.group({
      productCategoryName: [''],
      productCategoryId: ['' as any, Validators.required],
    }),
    productBaseGroup: this.formBuilder.group({
      productBaseName: [''],
      productBaseId: ['' as any, Validators.required],
    }),
    productVariantGroup: this.formBuilder.group({
      productVariantSku: [{ value: '', disabled: true }, Validators.required],
      productVariantName: [{ value: '', disabled: true }, Validators.required],
      productVariantDescription: [{ value: '', disabled: true }, Validators.required],
      productVariantSize: [{ value: '', disabled: true }, Validators.required],
      productVariantColor: [{ value: '', disabled: true }, Validators.required],
      productVariantPrice: [{ value: '', disabled: true }, Validators.required],
    }),
    images: [[]],
  });

  productImagesControl: AbstractControl | null; // ?? GETTER?

  @Input() isEdit: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private zone: NgZone,
    private productsService: ProductsService,
    private readonly messageService: MessageService
  ) {
    this.productImagesControl = this.productForm.get('images');
  }

  ngOnInit(): void {
    this.getProducts();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit(value: any) {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productCategory = value.productCategoryGroup.productCategoryId
      ? { productCategoryId: value.productCategoryGroup.productCategoryId }
      : { productCategoryName: value.productCategoryGroup.productCategoryName };

    const baseProduct = value.productBaseGroup.productBaseId
      ? { productBaseId: value.productBaseGroup.productBaseId }
      : { productBaseName: value.productBaseGroup.productBaseName };

    value = {
      images: value.images,
      ...value.productVariantGroup,
      ...baseProduct,
      ...productCategory,
    };

    if (this.isEdit) {
      value.existingImages = this.selectedProductImages.filter((image: any) => !image.remove);
      value.productVariantId = this.selectedProductVariant?.id;
    }

    const formData = new FormData();

    Object.keys(value).forEach((key) => {
      if (key === 'images') {
        value[key].forEach((image: any) => {
          formData.append('images', image);
        });
      } else if (this.isEdit && key === 'existingImages') {
        formData.append(key, JSON.stringify(value[key]))
      } else {
        formData.append(key, value[key]);
      }
    });

    if (this.isEdit) {
      this.productsService.editProduct(formData).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Продукт змінено',
          detail: 'Продукт успішно змінено',
        });
      });
    } else {
      this.productsService.createProduct(formData).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Продукт створено',
          detail: 'Продукт успішно створено',
        });
      });
    }
  }

  getProducts() {
    this.productsService
      .getProducts()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: ProductBase[]) => {
        this.productsCategories = this.getUniqueArrayByKey(
          data.map((item: ProductBase) => {
            return item.category;
          }),
          'id',
        );

        data.forEach((item: ProductBase) => {
          item.variants.forEach((variant: ProductVariant) => {
            this.productsList.push(variant)
          })
        })

        this.allBaseProducts = data;
      });

    this.isLoading = true;
  }

  subscribeToFormChanges() {
    this.productForm
      .get('productCategoryGroup')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onCategoryChange(value);
      });

    this.productForm
      .get('productBaseGroup')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.onBaseProductChange(value);
      });

    this.productForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (value.productVariantGroup) {
          const product = {
            variants: [
              {
                sku: value.productVariantGroup.productVariantSku,
                properties: {
                  name: value.productVariantGroup.productVariantName,
                  description:
                    value.productVariantGroup.productVariantDescription,
                  price: value.productVariantGroup.productVariantPrice,
                  size: value.productVariantGroup.productVariantSize,
                  color: value.productVariantGroup.productVariantColor,
                },
              },
            ],
          };

          this.product$.next(product);
        }
      });
  }

  onCategoryChange(value: any) {
    if (this.isEdit) {
      this.selectedCategory = this.productsCategories.find((category) => category.id === value.productCategoryId);
      this.baseProductChanges();
    } else {
      this.productForm.get('productBaseGroup')?.patchValue({
        productBaseId: '',
        productBaseName: '',
      });
      if (value.productCategoryId) {
        this.baseProductsByCategory = this.allBaseProducts.filter(
          (product) => product.category.id === value.productCategoryId,
        );
      }
      if (value.productCategoryId || value.productCategoryName) {
        this.productForm.get('productBaseGroup')?.enable();
      } else {
        this.productForm.get('productBaseGroup')?.disable();
      }
    }
  }

  onBaseProductChange(value: any) {
    if (this.isEdit) {
      if (value.productBaseId || value.productBaseName) {
        this.productImagesDisabled = false;
      } else {
        this.productImagesDisabled = true;
      }
      if (value.productBaseId) {
        this.selectedBaseProduct = this.allBaseProducts.find((base) => base.id === value.productBaseId);
      } else {
        this.selectedBaseProduct = { name: value.productBaseName } as ProductBase;
      }
      this.baseProductChanges();
      this.productVariantChanges();
    } else {
      if (value.productBaseId || value.productBaseName) {
        this.productForm.get('productVariantGroup')?.enable();
        this.productImagesDisabled = false;
      } else {
        this.productForm.get('productVariantGroup')?.disable();
        this.productImagesDisabled = true;
      }
    }
  }

  onProductSelected(product: any) {
    if (product.value) {
      this.productForm.get('productVariantGroup')?.patchValue({
        productVariantSku: product.value.sku,
        productVariantName: product.value.properties.name,
        productVariantDescription: product.value.properties.description,
        productVariantSize: product.value.properties.size,
        productVariantColor: product.value.properties.color,
        productVariantPrice: product.value.properties.price,
      });
      this.allBaseProducts.forEach((base: ProductBase) => {
        base.variants.map((variant: ProductVariant) => {
          if (variant.id === product.value.id) {
            this.selectedProductVariant = variant;
            this.selectedProductVariantDefaultBaseProduct = base;
            if (!this.newCategory) {
              this.productForm.get('productCategoryGroup')?.get('productCategoryId')?.patchValue(base.category.id);
            }
            if (!this.newProductBase) {
              this.productForm.get('productBaseGroup')?.get('productBaseId')?.patchValue(base.id);
            }
          }
        })
      })

      this.previewImagesList = this.previewImagesList.filter((el) => !this.selectedProductImagesUrls.includes(el));
      this.previewImagesList = [...this.previewImagesList, ...product.value.properties.images.map((image: any) => image.url)]
      this.selectedProductImages = product.value.properties.images;
      this.selectedProductImagesUrls = product.value.properties.images.map((image: any) => image.url);
      this.productForm.get('productVariantGroup')?.enable();
    } else {

      this.selectedProductImages = [];
      this.selectedProductImagesUrls = [];
      this.productForm.get('productVariantGroup')?.disable();
    }
  }

  toggleNewProductBase(isNewCategory?: boolean) {
    this.productForm.get('productBaseGroup')?.patchValue({
      productBaseId: '',
      productBaseName: '',
    });
    this.onBaseProductChange({ value: false });
    this.newProductBase =
      isNewCategory !== undefined ? isNewCategory : !this.newProductBase;

    if (this.newProductBase) {
      this.productForm
        .get('productBaseGroup')
        ?.get('productBaseName')
        ?.setValidators([Validators.required]);
      this.productForm
        .get('productBaseGroup')
        ?.get('productBaseId')
        ?.clearValidators();
    } else {
      this.productForm
        .get('productBaseGroup')
        ?.get('productBaseId')
        ?.setValidators([Validators.required]);
      this.productForm
        .get('productBaseGroup')
        ?.get('productBaseName')
        ?.clearValidators();
    }
    this.productForm.get('productBaseGroup')?.updateValueAndValidity();
  }

  toggleNewCategory() {
    this.productForm.get('productBaseGroup')?.patchValue({
      productBaseId: '',
      productBaseName: '',
    });
    this.productForm.get('productCategoryGroup')?.patchValue({
      productCategoryId: '',
      productCategoryName: '',
    });

    this.newCategory = !this.newCategory;
    this.toggleNewProductBase(this.newCategory);

    if (this.newCategory) {
      this.productForm
        .get('productCategoryGroup')
        ?.get('productCategoryName')
        ?.setValidators([Validators.required]);
      this.productForm
        .get('productCategoryGroup')
        ?.get('productCategoryId')
        ?.clearValidators();
    } else {
      this.productForm
        .get('productCategoryGroup')
        ?.get('productCategoryId')
        ?.setValidators([Validators.required]);
      this.productForm
        .get('productCategoryGroup')
        ?.get('productCategoryName')
        ?.clearValidators();
    }
    this.productForm
      .get('productCategoryGroup')
      ?.updateValueAndValidity();
  }

  onUpload(event: FileUpload) {
    if (this.productImagesControl) {
      this.productImagesControl?.patchValue(event.files);
      this.makeFilesSrcList(event.files);
    }
  }

  onRemove(event: any) {
    if (this.productImagesControl) {
      this.productImagesControl.patchValue([
        ...this.productImagesControl.value.filter(
          (file: any) => file.name !== event.file.name,
        ),
      ]);
      this.removeFileSrcFromList(event.file);
    }
  }

  setImageActive(image: any) {
    image.active = !image.active;
  }

  removeProductImage(image: any) {
    image.remove = !image.remove;
  }

  private removeFileSrcFromList(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.zone.run(() => {
        const index = this.previewImagesList.findIndex(
          (item: any) => item === reader.result,
        );
        this.previewImagesList = this.previewImagesList.filter(
          (item: any, i: number) => {
            if (i !== index) {
              return item;
            }
          },
        );
      });
    };
  }

  private makeFilesSrcList(files: File[]) {
    files.map((file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.previewImagesList.indexOf(reader.result) === -1) {
          this.previewImagesList = [reader.result, ...this.previewImagesList];
        }
      };
    });
  }

  private baseProductChanges() {
    if (this.selectedCategory?.id && this.selectedBaseProduct?.category && this.selectedBaseProduct?.category?.id !== this.selectedCategory?.id) {
      this.baseProductCategoryChange = {
        title: 'Категорію базового продукту',
        old: this.selectedBaseProduct.category.name,
        new: this.selectedCategory.name
      };
    } else {
      this.baseProductCategoryChange = null;
    }
  }


  private productVariantChanges() {
    if (!this.selectedBaseProduct?.variants?.find((variant) => variant.id === this.selectedProductVariant?.id) || this.newProductBase) {
      this.productBaseProductChange = {
        title: 'Базовий продукт',
        old: this.selectedProductVariantDefaultBaseProduct.name,
        new: this.selectedBaseProduct?.name
      }
    } else {
      this.productBaseProductChange = null;
    }
  }

  private getUniqueArrayByKey(arr: any[], key: string): any[] {
    return Array.from(new Map(arr.map((item) => [item[key], item])).values());
  }
}
