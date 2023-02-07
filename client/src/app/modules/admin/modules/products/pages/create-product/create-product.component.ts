import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import {
  ProductBaseForCreation,
  ProductCategory,
  ProductVariant,
} from '@shared/interfaces/products';
import { GetProductsForCreationResponse } from '@shared/interfaces/responses/get-products.response';
import { ProductsService } from '@shared/services/products.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component( {
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
} )
export class CreateProductComponent implements OnInit, OnDestroy {
  emptyProduct = {
    variants: [
      {
        sku: '',
        name: '',
        description: '',
        price: 0,
        size: '',
        color: '',
        images: [],
      },
    ] as Partial<ProductVariant>[],
  };
  productsCategories: ProductCategory[] = [];
  allBaseProducts: ProductBaseForCreation[] = [];
  baseProductsByCategory: ProductBaseForCreation[] = [];
  colors: any[] = [{ name: 'red' }, { name: 'green' }, { name: 'blue' }];
  sizes: any[] = [{ name: '1m' }, { name: '1.5m' }, { name: '2m' }];
  product$: BehaviorSubject<any> = new BehaviorSubject( this.emptyProduct );
  acceptedFiles = '.jpg, .png, .jpeg';
  invalidFileTypeMessage = `Некоректний тип файлу. Дозволено файли тільки таких типів: ${this.acceptedFiles}.`;

  previewImagesList: any[] = [];
  newProductBase = false;
  newCategory = false;
  productImagesDisabled = true;
  activeIndex = 0;
  productImagesControl: AbstractControl | null;
  destroy$: Subject<boolean> = new Subject();

  productCreateForm = this.formBuilder.group( {
    productCategoryGroup: this.formBuilder.group( {
      productCategoryName: [''],
      productCategoryId: ['', Validators.required],
    } ),
    productBaseGroup: this.formBuilder.group( {
      productBaseName: [{ value: '', disabled: true }],
      productBaseId: [{ value: '', disabled: true }, Validators.required],
    } ),
    productVariantGroup: this.formBuilder.group( {
      productVariantSku: [{ value: '', disabled: true }, Validators.required],
      productVariantName: [{ value: '', disabled: true }, Validators.required],
      productVariantDescription: [
        { value: '', disabled: true },
        Validators.required,
      ],
      productVariantSize: [{ value: '', disabled: true }, Validators.required],
      productVariantColor: [{ value: '', disabled: true }, Validators.required],
      productVariantPrice: [{ value: '', disabled: true }, Validators.required],
    } ),
    images: [{ value: [], disabled: true }, Validators.required],
  } );

  @ViewChild( 'fileUpload' ) fileUpload: any;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private zone: NgZone,
    private readonly messageService: MessageService,
  ) {
    this.productImagesControl = this.productCreateForm.get( 'images' );
  }

  ngOnInit(): void {
    this.getProductsForCreation();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next( true );
    this.destroy$.complete();
  }

  onSubmit( value: any ) {
    if ( !this.productCreateForm.valid ) {
      this.productCreateForm.markAllAsTouched();
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

    const formData = new FormData();

    Object.keys( value ).forEach( ( key ) => {
      if ( key === 'images' ) {
        value[key].forEach( ( image: any ) => {
          formData.append( 'images', image );
        } );
      } else {
        formData.append( key, value[key] );
      }
    } );

    this.productsService.createProduct( formData ).subscribe( () => {
      this.messageService.add( {
        severity: 'success',
        summary: 'Продукт створено',
        detail: 'Продукт успішно створено',
      } );

      this.productImagesControl?.patchValue( [] );
      this.previewImagesList = [];
      this.product$.next( this.emptyProduct );
      this.fileUpload.clear();
      this.productCreateForm.reset();
    } );
  }

  subscribeToFormChanges() {
    this.productCreateForm
      .get( 'productCategoryGroup' )
      ?.valueChanges.pipe( takeUntil( this.destroy$ ) )
      .subscribe( ( value: any ) => {
        this.onCategoryChange( value );
      } );

    this.productCreateForm
      .get( 'productBaseGroup' )
      ?.valueChanges.pipe( takeUntil( this.destroy$ ) )
      .subscribe( ( value: any ) => {
        this.onBaseProductChange( value );
      } );

    this.productCreateForm.valueChanges
      .pipe( takeUntil( this.destroy$ ) )
      .subscribe( ( value: any ) => {
        if ( value.productVariantGroup ) {
          const product = {
            variants: [
              {
                sku: value.productVariantGroup.productVariantSku,
                name: value.productVariantGroup.productVariantName,
                description:
                  value.productVariantGroup.productVariantDescription,
                price: value.productVariantGroup.productVariantPrice,
                size: value.productVariantGroup.productVariantSize,
                color: value.productVariantGroup.productVariantColor,
              },
            ],
          };

          this.product$.next( product );
        }
      } );
  }

  onCategoryChange( value: any ) {
    this.productCreateForm.get( 'productBaseGroup' )?.patchValue( {
      productBaseId: '',
      productBaseName: '',
    } );
    if ( value.productCategoryId ) {
      this.baseProductsByCategory = this.allBaseProducts.filter(
        ( product ) => product.category.id === value.productCategoryId,
      );
    }
    if ( value.productCategoryId || value.productCategoryName ) {
      this.productCreateForm.get( 'productBaseGroup' )?.enable();
    } else {
      this.productCreateForm.get( 'productBaseGroup' )?.disable();
    }
  }

  onBaseProductChange( value: any ) {
    if ( value.productBaseId || value.productBaseName ) {
      this.productCreateForm.get( 'productVariantGroup' )?.enable();
      this.productImagesControl?.enable();
      this.productImagesDisabled = false;
    } else {
      this.productCreateForm.get( 'productVariantGroup' )?.disable();
      this.productImagesControl?.disable();
      this.productImagesDisabled = true;
    }
  }

  toggleNewProductBase( isNewCategory?: boolean ) {
    this.productCreateForm.get( 'productBaseGroup' )?.patchValue( {
      productBaseId: '',
      productBaseName: '',
    } );
    this.onBaseProductChange( { value: false } );
    this.newProductBase = isNewCategory !== undefined ? isNewCategory : !this.newProductBase;

    if ( this.newProductBase ) {
      this.productCreateForm
        .get( 'productBaseGroup' )
        ?.get( 'productBaseName' )
        ?.setValidators( [Validators.required] );
      this.productCreateForm
        .get( 'productBaseGroup' )
        ?.get( 'productBaseId' )
        ?.clearValidators();
    } else {
      this.productCreateForm
        .get( 'productBaseGroup' )
        ?.get( 'productBaseId' )
        ?.setValidators( [Validators.required] );
      this.productCreateForm
        .get( 'productBaseGroup' )
        ?.get( 'productBaseName' )
        ?.clearValidators();
    }
    this.productCreateForm.get( 'productBaseGroup' )?.updateValueAndValidity();
  }

  toggleNewCategory() {
    this.productCreateForm.get( 'productBaseGroup' )?.patchValue( {
      productBaseId: '',
      productBaseName: '',
    } );
    this.productCreateForm.get( 'productCategoryGroup' )?.patchValue( {
      productCategoryId: '',
      productCategoryName: '',
    } );

    this.newCategory = !this.newCategory;
    this.toggleNewProductBase( this.newCategory );


    if ( this.newCategory ) {
      this.productCreateForm
        .get( 'productCategoryGroup' )
        ?.get( 'productCategoryName' )
        ?.setValidators( [Validators.required] );
      this.productCreateForm
        .get( 'productCategoryGroup' )
        ?.get( 'productCategoryId' )
        ?.clearValidators();
    } else {
      this.productCreateForm
        .get( 'productCategoryGroup' )
        ?.get( 'productCategoryId' )
        ?.setValidators( [Validators.required] );
      this.productCreateForm
        .get( 'productCategoryGroup' )
        ?.get( 'productCategoryName' )
        ?.clearValidators();
    }
    this.productCreateForm
      .get( 'productCategoryGroup' )
      ?.updateValueAndValidity();
  }

  onUpload( event: FileUpload ) {
    if ( !this.productImagesControl?.disabled ) {
      this.productImagesControl?.patchValue( event.files );
      this.makeFilesSrcList( event.files );
    }
  }

  onRemove( event: any ) {
    if ( !this.productImagesControl?.disabled ) {
      this.productImagesControl?.patchValue( [
        ...this.productImagesControl?.value.filter(
          ( file: any ) => file.name !== event.file.name,
        ),
      ] );
      this.removeFileSrcFromList( event.file );
    }
  }

  getProductsForCreation() {
    this.productsService
      .getProductsForCreation()
      .subscribe( ( data: GetProductsForCreationResponse ) => {
        this.productsCategories = this.getUniqueArrayByKey(
          data.map( ( item: ProductBaseForCreation ) => {
            return item.category;
          } ),
          'id',
        );

        this.allBaseProducts = data;
      } );
  }

  private removeFileSrcFromList( file: File ) {
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = () => {
      this.zone.run( () => {
        const index = this.previewImagesList.findIndex(
          ( item: any ) => item === reader.result,
        );
        this.previewImagesList = this.previewImagesList.filter(
          ( item: any, i: number ) => {
            if ( i !== index ) {
              return item;
            }
          },
        );
      } );
    };
  }

  private makeFilesSrcList( files: File[] ) {
    files.map( ( file: File ) => {
      const reader = new FileReader();
      reader.readAsDataURL( file );
      reader.onload = () => {
        if ( this.previewImagesList.indexOf( reader.result ) === -1 ) {
          this.previewImagesList = [...this.previewImagesList, reader.result];
        }
      };
    } );
  }

  private getUniqueArrayByKey( arr: any[], key: string ): any[] {
    return Array.from( new Map( arr.map( ( item ) => [item[key], item] ) ).values() );
  }
}
