import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Component, ViewChild } from '@angular/core';

import { ProductSize } from '@shared/interfaces/entities/product.entity';

import { ProductSizesService } from '../../../../services/product-sizes.service';

@Component({
  selector: 'app-product-sizes',
  templateUrl: './product-sizes.component.html',
  styleUrls: ['./product-sizes.component.scss'],
})
export class ProductSizesComponent {
  sizeDialog!: boolean;
  sizes!: ProductSize[];
  size!: ProductSize;
  submitted!: boolean;

  @ViewChild('productSizesTable') productSizesTable!: Table;

  constructor(
    private productSizesService: ProductSizesService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.productSizesService
      .getAllSizes()
      .subscribe((data) => (this.sizes = data));
  }

  filterSizes(event: any) {
    this.productSizesTable.filterGlobal(event.target.value, 'contains');
  }

  openNew() {
    this.size = {} as ProductSize;
    this.submitted = false;
    this.sizeDialog = true;
  }

  editSize(size: ProductSize) {
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
      this.productSizesService
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
      this.productSizesService.createSize(this.size).subscribe((data) => {
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
    this.size = {} as ProductSize;
  }
}
