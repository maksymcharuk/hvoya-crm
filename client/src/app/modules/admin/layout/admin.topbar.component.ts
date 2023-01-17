import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '@shared/layout/services/layout.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'admin-topbar',
  templateUrl: './admin.topbar.component.html',
})
export class AdminTopBarComponent {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
