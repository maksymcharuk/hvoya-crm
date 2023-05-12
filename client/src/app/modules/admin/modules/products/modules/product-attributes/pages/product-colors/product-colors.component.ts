import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Component, ViewChild } from '@angular/core';

import { ProductColor } from '@shared/interfaces/entities/product.entity';

import { ProductColorsService } from '../../../../services/product-colors.service';

@Component({
  selector: 'app-product-colors',
  templateUrl: './product-colors.component.html',
  styleUrls: ['./product-colors.component.scss'],
})
export class ProductColorsComponent {
  colorDialog!: boolean;
  colors!: ProductColor[];
  color!: ProductColor;
  submitted!: boolean;

  @ViewChild('productColorsTable') productColorsTable!: Table;

  constructor(
    private productColorsService: ProductColorsService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.productColorsService
      .getAllColors()
      .subscribe((data) => (this.colors = data));
  }

  filterColors(event: any) {
    this.productColorsTable.filterGlobal(event.target.value, 'contains');
  }

  openNew() {
    this.color = {} as ProductColor;
    this.submitted = false;
    this.colorDialog = true;
  }

  editColor(color: ProductColor) {
    this.color = { ...color };
    this.colorDialog = true;
  }

  hideDialog() {
    this.colorDialog = false;
    this.submitted = false;
  }

  saveColor() {
    this.submitted = true;

    if (this.color.id) {
      this.productColorsService
        .updateColor(this.color.id, this.color)
        .subscribe((data) => {
          this.colors[this.findIndexById(this.color.id)] = data;
          this.messageService.add({
            severity: 'success',
            detail: 'Колір оновлено',
          });
          this.cleanUp();
        });
    } else {
      this.productColorsService.createColor(this.color).subscribe((data) => {
        this.colors.push(data);
        this.messageService.add({
          severity: 'success',
          detail: 'Новий колір створено',
        });
        this.cleanUp();
      });
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.colors.length; i++) {
      if (this.colors[i]?.id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  cleanUp() {
    this.colors = [...this.colors];
    this.colorDialog = false;
    this.color = {} as ProductColor;
  }
}
