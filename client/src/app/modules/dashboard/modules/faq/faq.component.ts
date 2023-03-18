import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { Faq } from '@shared/interfaces/faq.interface';
import { FaqService } from '@shared/services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  faqList$ = new BehaviorSubject<Faq[]>([]);

  constructor(private readonly faqService: FaqService) {
    this.faqService.getAll().subscribe((faqList) => {
      this.faqList$.next(faqList);
    });
  }
}
