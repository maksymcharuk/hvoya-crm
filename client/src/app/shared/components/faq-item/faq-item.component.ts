import { ConfirmationService, MenuItem } from 'primeng/api';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { Faq } from '@shared/interfaces/entities/faq.entity';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrls: ['./faq-item.component.scss'],
  providers: [ConfirmationService],
})
export class FaqItemComponent implements OnChanges {
  @Input() faq!: Faq;

  @Output() onUpdate = new EventEmitter<Faq>();
  @Output() onPublishToggle = new EventEmitter<Faq>();

  items: MenuItem[] = [];

  constructor(private readonly confirmationService: ConfirmationService) {}

  ngOnChanges() {
    this.items = [
      {
        label: 'Налаштування',
        items: [
          {
            label: 'Редагувати',
            icon: 'pi pi-refresh',
            command: () => {
              this.update();
            },
          },
          {
            label: `${this.faq?.isPublished ? 'Приховати' : 'Опублікувати'}`,
            icon: `pi pi-${this.faq?.isPublished ? 'eye-slash' : 'eye'}`,
            command: () => {
              this.publishToggle();
            },
          },
        ],
      },
    ];
  }

  update() {
    this.onUpdate.emit(this.faq);
  }

  publishToggle() {
    this.confirmationService.confirm({
      accept: () => {
        this.onPublishToggle.emit(this.faq);
      },
    });
  }
}
