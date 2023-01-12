import { Component } from '@angular/core';
import { LayoutService } from '@shared/layout/services/layout.service';

@Component({
  selector: 'dashboard-footer',
  templateUrl: './dashboard.footer.component.html',
})
export class DashboardFooterComponent {
  constructor(public layoutService: LayoutService) {}
}
