import { BehaviorSubject } from 'rxjs';

import { Component, HostListener } from '@angular/core';

import { ComponentCanDeactivate } from '@shared/guards/pending-changes/pending-changes.guard';
import { Faq } from '@shared/interfaces/faq.interface';
import { FaqService } from '@shared/services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements ComponentCanDeactivate {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (this.isOrderChanged) {
      event.preventDefault();
      return (event.returnValue = '');
    }
    return true;
  }

  faqList$ = new BehaviorSubject<Faq[]>([]);
  isOrderChanged = false;

  constructor(private readonly faqService: FaqService) {
    this.faqService.getAll().subscribe((faqList) => {
      this.faqList$.next(faqList);
    });
  }

  canDeactivate() {
    return !this.isOrderChanged;
  }

  onOrderChanged(isOrderChanged: boolean) {
    this.isOrderChanged = isOrderChanged;
  }
}
