import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, finalize } from 'rxjs';

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PROM_IMPORT_LINK } from '@shared/constants/product.constants';
import { ProductsImportSourceType } from '@shared/enums/products-import-source-type';
import { ProductsImportSource } from '@shared/enums/products-import-source.enum';
import {
  ImportProductsDTO,
  ImportProductsFormGroup,
} from '@shared/interfaces/dto/import-products.dto';
import { ProductsTransferImportResponse } from '@shared/interfaces/responses/products-transfer-import.response';
import { ProductsTransferService } from '@shared/services/products-transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent {
  importResults$ = new BehaviorSubject<ProductsTransferImportResponse | null>(
    null,
  );
  submitting = false;

  importSourceTypeEnum = ProductsImportSourceType;

  importSources = [{ label: 'Prom.ua', value: ProductsImportSource.Prom }];
  importSourceTypes = [
    { label: 'Посилання', value: ProductsImportSourceType.Link },
    { label: 'Файл', value: ProductsImportSourceType.File },
  ];

  importForm = this.formBuilder.group({
    source: [this.importSources[0]?.value, Validators.required],
    sourceType: [this.importSourceTypes[0]?.value, Validators.required],
    link: [PROM_IMPORT_LINK, Validators.required],
    file: [{ value: '', disabled: true }, Validators.required],
  }) as ImportProductsFormGroup;

  get sourceType() {
    return this.importForm.get('sourceType');
  }

  get link() {
    return this.importForm.get('link');
  }

  get file() {
    return this.importForm.get('file');
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productsTransferService: ProductsTransferService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.importForm.get('sourceType')?.valueChanges.subscribe((value) => {
      if (value === ProductsImportSourceType.Link) {
        this.link?.enable();
        this.link?.setValidators(Validators.required);
        this.link?.updateValueAndValidity();
        this.file?.disable();
        this.file?.clearValidators();
        this.file?.updateValueAndValidity();
      } else {
        this.file?.enable();
        this.file?.setValidators(Validators.required);
        this.file?.updateValueAndValidity();
        this.link?.disable();
        this.link?.clearValidators();
        this.link?.updateValueAndValidity();
      }
    });
  }

  onFileUpload(event: any) {
    this.file?.patchValue(event.files[0]);
  }

  onImportSubmit() {
    if (!this.importForm.valid) {
      this.importForm.markAllAsTouched();
      return;
    }
    this.sourceType?.disable();
    this.submitting = true;

    const formData = new FormData();
    const value = this.importForm.value;

    Object.keys(value).forEach((key) => {
      if (value[key as keyof ImportProductsDTO]) {
        formData.append(key, value[key as keyof ImportProductsDTO] as string);
      }
    });

    this.productsTransferService
      .importProducts(formData)
      .pipe(
        finalize(() => {
          this.submitting = false;
          this.sourceType?.enable();
        }),
        catchError((err: any) => {
          this.importResults$.next(err.error.stats);
          throw err;
        }),
      )
      .subscribe((response: ProductsTransferImportResponse) => {
        this.importResults$.next(response);
        this.messageService.add({
          severity: 'success',
          detail: 'Товари успішно імпортовано',
        });
      });
  }
}
