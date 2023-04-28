import { Component } from '@angular/core';

import { LayoutService } from '@shared/layout/services/layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) {}
}
