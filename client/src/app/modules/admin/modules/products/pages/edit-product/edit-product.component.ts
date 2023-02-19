import { Component, NgZone, ViewChild } from '@angular/core';
import { AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { ProductProperties, ProductVariant, ProductCategory, ProductBase } from '@shared/interfaces/products';
import { ProductsService } from '@shared/services/products.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
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
  productsCategories: ProductCategory[] = [];
  baseProducts: ProductBase[] = [];
  selectedProductImages: any = [];
  selectedProductImagesUrls: string[] = [];
  productsList: ProductVariant[] = [];
  colors: any[] = [{ name: 'red' }, { name: 'green' }, { name: 'blue' }];
  sizes: any[] = [{ name: '1m' }, { name: '1.5m' }, { name: '2m' }];
  product$: BehaviorSubject<any> = new BehaviorSubject(this.emptyProduct);
  acceptedFiles = '.jpg, .png, .jpeg';
  invalidFileTypeMessage = `Некоректний тип файлу. Дозволено файли тільки таких типів: ${this.acceptedFiles}.`;
  selectedBaseProduct: ProductBase | undefined = undefined;
  selectedCategory: ProductCategory | undefined = undefined;
  selectedProductVariant: ProductVariant | undefined = undefined;
  selectedProductVariantDefaultBaseProduct!: ProductBase;

  previewImagesList: any[] = [];
  newProductBase = false;
  newCategory = false;
  productImagesDisabled = true;
  isLoading = false;
  baseProductCategoryChange: string | null = null;
  productBaseProductChange: string | null = null;
  activeIndex = 0;
  productImagesControl: AbstractControl | null;
  destroy$: Subject<boolean> = new Subject();

  productEditForm = this.formBuilder.group({
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

  @ViewChild('fileUpload') fileUpload: any;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private zone: NgZone,
    private readonly messageService: MessageService,
  ) {
    this.productImagesControl = this.productEditForm.get('images');
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
    if (!this.productEditForm.valid) {
      this.productEditForm.markAllAsTouched();
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
      existingImages: this.selectedProductImages.filter((image: any) => !image.remove),
      productVariantId: this.selectedProductVariant?.id,
      ...value.productVariantGroup,
      ...baseProduct,
      ...productCategory,
    };

    const formData = new FormData();

    Object.keys(value).forEach((key) => {
      if (key === 'images') {
        value[key]?.forEach((image: any) => {
          formData.append('images', image);
        });
      } else if (key === 'existingImages') {
        formData.append(key, JSON.stringify(value[key]))
      } else {
        formData.append(key, value[key]);
      }
    });

    this.productsService.editProduct(formData).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Продукт змінено',
        detail: 'Продукт змінено успішно',
      });
    });
  }

  subscribeToFormChanges() {
    this.productEditForm
      .get('productCategoryGroup')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onCategoryChange(value);
      });

    this.productEditForm
      .get('productBaseGroup')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        this.onBaseProductChange(value);
      });

    this.productEditForm.valueChanges
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
    this.selectedCategory = this.productsCategories.find((category) => category.id === value.productCategoryId);
    this.baseProductChanges();
  }

  onBaseProductChange(value: any) {
    if (value.productBaseId || value.productBaseName) {
      this.productImagesControl?.enable();
      this.productImagesDisabled = false;
    } else {
      this.productImagesControl?.disable();
      this.productImagesDisabled = true;
    }
    this.selectedBaseProduct = this.baseProducts.find((base) => base.id === value.productBaseId);
    this.baseProductChanges();
    this.productVariantChanges();
  }

  onProductSelected(product: any) {
    if (product.value) {
      this.productEditForm.get('productVariantGroup')?.patchValue({
        productVariantSku: product.value.sku,
        productVariantName: product.value.properties.name,
        productVariantDescription: product.value.properties.description,
        productVariantSize: product.value.properties.size,
        productVariantColor: product.value.properties.color,
        productVariantPrice: product.value.properties.price,
      });
      this.baseProducts.forEach((base: ProductBase) => {
        base.variants.map((variant: ProductVariant) => {
          if (variant.id === product.value.id) {
            this.selectedProductVariant = variant;
            this.selectedProductVariantDefaultBaseProduct = base;
            if (!this.newCategory) {
              this.productEditForm.get('productCategoryGroup')?.get('productCategoryId')?.patchValue(base.category.id);
            }
            if (!this.newProductBase) {
              this.productEditForm.get('productBaseGroup')?.get('productBaseId')?.patchValue(base.id);
            }
          }
        })
      })

      this.previewImagesList = this.previewImagesList.filter((el) => !this.selectedProductImagesUrls.includes(el));
      this.previewImagesList = [...this.previewImagesList, ...product.value.properties.images.map((image: any) => image.url)]
      this.selectedProductImages = product.value.properties.images;
      this.selectedProductImagesUrls = product.value.properties.images.map((image: any) => image.url);
      this.productEditForm.get('productVariantGroup')?.enable();
    } else {

      this.selectedProductImages = [];
      this.selectedProductImagesUrls = [];
      this.productEditForm.get('productVariantGroup')?.disable();
    }
  }

  toggleNewProductBase(isNewCategory?: boolean) {
    this.productEditForm.get('productBaseGroup')?.patchValue({
      productBaseId: '',
      productBaseName: '',
    });
    this.onBaseProductChange({ value: false });
    this.newProductBase =
      isNewCategory !== undefined ? isNewCategory : !this.newProductBase;

    if (this.newProductBase) {
      this.productEditForm
        .get('productBaseGroup')
        ?.get('productBaseName')
        ?.setValidators([Validators.required]);
      this.productEditForm
        .get('productBaseGroup')
        ?.get('productBaseId')
        ?.clearValidators();
    } else {
      this.productEditForm
        .get('productBaseGroup')
        ?.get('productBaseId')
        ?.setValidators([Validators.required]);
      this.productEditForm
        .get('productBaseGroup')
        ?.get('productBaseName')
        ?.clearValidators();
    }
    this.productEditForm.get('productBaseGroup')?.updateValueAndValidity();
  }

  toggleNewCategory() {
    this.productEditForm.get('productBaseGroup')?.patchValue({
      productBaseId: '',
      productBaseName: '',
    });
    this.productEditForm.get('productCategoryGroup')?.patchValue({
      productCategoryId: '',
      productCategoryName: '',
    });

    this.newCategory = !this.newCategory;
    this.toggleNewProductBase(this.newCategory);

    if (this.newCategory) {
      this.productEditForm
        .get('productCategoryGroup')
        ?.get('productCategoryName')
        ?.setValidators([Validators.required]);
      this.productEditForm
        .get('productCategoryGroup')
        ?.get('productCategoryId')
        ?.clearValidators();
    } else {
      this.productEditForm
        .get('productCategoryGroup')
        ?.get('productCategoryId')
        ?.setValidators([Validators.required]);
      this.productEditForm
        .get('productCategoryGroup')
        ?.get('productCategoryName')
        ?.clearValidators();
    }
    this.productEditForm
      .get('productCategoryGroup')
      ?.updateValueAndValidity();
  }

  onUpload(event: FileUpload) {
    if (!this.productImagesControl?.disabled) {
      this.productImagesControl?.patchValue(event.files);
      this.makeFilesSrcList(event.files);
    }
  }

  onRemove(event: any) {
    if (!this.productImagesControl?.disabled) {
      this.productImagesControl?.patchValue([
        ...this.productImagesControl?.value.filter(
          (file: any) => file.name !== event.file.name,
        ),
      ]);
      this.removeFileSrcFromList(event.file);
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

        this.baseProducts = data;
      });

    this.isLoading = true;
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

  private getUniqueArrayByKey(arr: any[], key: string): any[] {
    return Array.from(new Map(arr.map((item) => [item[key], item])).values());
  }

  private baseProductChanges() {
    if (this.selectedCategory?.id && this.selectedBaseProduct && this.selectedBaseProduct.category.id !== this.selectedCategory?.id) {
      this.baseProductCategoryChange = `
      <div>Категорію базового продукту буде змінено з</div>
      <div><strong>"${this.selectedBaseProduct.category.name}"</strong></div>
      <div>на</div>
      <div><strong>"${this.selectedCategory.name}"</strong></div>
      `;
    } else {
      this.baseProductCategoryChange = null;
    }
  }

  private productVariantChanges() {
    if (!this.selectedBaseProduct?.variants.find((variant) => variant.id === this.selectedProductVariant?.id)) {
      this.productBaseProductChange = `
      <div>Базовий продукт буде змінено з</div>
      <div><strong>"${this.selectedProductVariantDefaultBaseProduct.name}"</strong></div>
      <div>на</div>
      <div><strong>"${this.selectedBaseProduct?.name}"</strong></div>
      `;
    } else {
      this.productBaseProductChange = null;
    }
  }
}
