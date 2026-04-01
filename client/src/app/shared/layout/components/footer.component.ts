import { Component } from '@angular/core';

import { LayoutService } from '@shared/layout/services/layout.service';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) {}
}
