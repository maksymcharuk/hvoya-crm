import { ConfirmationService, MessageService } from 'primeng/api';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Faq } from '@shared/interfaces/entities/faq.entity';
import { FaqService } from '@shared/services/faq.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss'],
  providers: [ConfirmationService],
})
export class FaqListComponent {
  @Input() faqList: Faq[] = [];
  @Output() onOrderChanged = new EventEmitter<boolean>(false);

  faqDialog!: boolean;
  faq!: Faq;
  submitted!: boolean;
  startIndex = 0;
  faqEntity = Faq;

  private _isOrderChanged = false;

  set isOrderChanged(value: boolean) {
    this._isOrderChanged = value;
    this.onOrderChanged.emit(value);
  }

  get isOrderChanged() {
    return this._isOrderChanged;
  }

  constructor(
    private readonly faqService: FaqService,
    private readonly messageService: MessageService,
  ) {}

  onDragStart(index: number) {
    this.startIndex = index;
  }

  onDrop(dropIndex: number) {
    const faq = this.faqList[this.startIndex]; // get element

    if (!faq) {
      return;
    }

    this.isOrderChanged = true;
    this.insertFaqItem(faq, dropIndex, this.startIndex);
  }

  onOrderSave() {
    this.faqService.updateBatch(this.faqList).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: 'Порядок питань/відповідей збережено',
      });
      this.isOrderChanged = false;
    });
  }

  onFaqItemPublishToggle(faq: Faq) {
    this.faqService
      .update(faq.id, { isPublished: !faq.isPublished })
      .subscribe((updatedFaq: Faq) => {
        this.faqList[this.findIndexById(faq.id)] = {
          ...faq,
          ...updatedFaq,
        };
        this.messageService.add({
          severity: 'success',
          detail: `Запитання/відповідь успішно ${
            updatedFaq.isPublished ? 'опубліковано' : 'знято з публікації'
          }`,
        });
      });
  }

  openNew() {
    this.faq = {} as Faq;
    this.submitted = false;
    this.faqDialog = true;
  }

  editFaq(faq: Faq) {
    this.faq = { ...faq };
    this.faqDialog = true;
  }

  hideDialog() {
    this.faqDialog = false;
    this.submitted = false;
  }

  saveFaq() {
    this.submitted = true;

    if (this.faq.id) {
      this.faqService.update(this.faq.id, this.faq).subscribe((data) => {
        this.faqList[this.findIndexById(this.faq.id)] = data;
        this.messageService.add({
          severity: 'success',
          detail: 'Запитання оновлено',
        });
        this.cleanUp();
      });
    } else {
      this.faq.order = this.faqList.length + 1;
      this.faqService.create(this.faq).subscribe((data) => {
        this.faqList.push(data);
        this.messageService.add({
          severity: 'success',
          detail: 'Новe запитання створено',
        });
        this.cleanUp();
      });
    }
  }

  private findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.faqList.length; i++) {
      if (this.faqList[i]?.id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  private cleanUp() {
    this.faqList = [...this.faqList];
    this.faqDialog = false;
    this.faq = {} as Faq;
  }

  private insertFaqItem(faq: Faq, dropIndex?: number, startIndex?: number) {
    if (startIndex !== undefined) {
      this.faqList.splice(startIndex, 1); // delete from old position
    }

    if (dropIndex !== undefined) {
      this.faqList.splice(dropIndex, 0, faq); // add to new position
    } else {
      this.faqList.push(faq); // add to end
    }

    for (let faq of this.faqList) {
      faq.order = this.faqList.indexOf(faq) + 1;
    }
  }
}
