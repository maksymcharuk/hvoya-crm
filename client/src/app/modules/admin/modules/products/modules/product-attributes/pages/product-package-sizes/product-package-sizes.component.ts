import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Component, ViewChild } from '@angular/core';

import { ProductPackageSize } from '@shared/interfaces/entities/product.entity';

import { ProductPackageSizesService } from '../../../../services/product-package-sizes.service';

@Component({
  selector: 'app-product-package-sizes',
  templateUrl: './product-package-sizes.component.html',
  styleUrls: ['./product-package-sizes.component.scss'],
})
export class ProductPackageSizesComponent {
  sizeDialog!: boolean;
  sizes!: ProductPackageSize[];
  size!: ProductPackageSize;
  submitted!: boolean;
  rows = 5;

  @ViewChild('productSizesTable') productSizesTable!: Table;

  constructor(
    private productPackageSizesService: ProductPackageSizesService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.productPackageSizesService
      .getAllSizes()
      .subscribe((data) => (this.sizes = data));
  }

  filterSizes(event: any) {
    this.productSizesTable.filterGlobal(event.target.value, 'contains');
  }

  openNew() {
    this.size = {} as ProductPackageSize;
    this.submitted = false;
    this.sizeDialog = true;
  }

  editSize(size: ProductPackageSize) {
    this.size = { ...size };
    this.sizeDialog = true;
  }

  hideDialog() {
    this.sizeDialog = false;
    this.submitted = false;
  }

  saveSize() {
    this.submitted = true;

    if (this.size.id) {
      this.productPackageSizesService
        .updateSize(this.size.id, this.size)
        .subscribe((data) => {
          this.sizes[this.findIndexById(this.size.id)] = data;
          this.messageService.add({
            severity: 'success',
            detail: 'Розмір оновлено',
          });
          this.cleanUp();
        });
    } else {
      this.productPackageSizesService
        .createSize(this.size)
        .subscribe((data) => {
          this.sizes.push(data);
          this.messageService.add({
            severity: 'success',
            detail: 'Новий розмір створено',
          });
          this.cleanUp();
        });
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.sizes.length; i++) {
      if (this.sizes[i]?.id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  cleanUp() {
    this.sizes = [...this.sizes];
    this.sizeDialog = false;
    this.size = {} as ProductPackageSize;
  }
}
