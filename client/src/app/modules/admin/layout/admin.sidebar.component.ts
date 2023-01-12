import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '@shared/layout/services/layout.service';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin.sidebar.component.html',
})
export class AdminSidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
