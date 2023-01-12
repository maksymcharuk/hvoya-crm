import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '@shared/layout/services/layout.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './dashboard.sidebar.component.html',
})
export class DashboardSidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
