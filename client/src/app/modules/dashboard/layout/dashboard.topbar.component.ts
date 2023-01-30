import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

import { MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { LayoutService } from '@shared/layout/services/layout.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'dashboard-topbar',
  templateUrl: './dashboard.topbar.component.html',
})
export class DashboardTopBarComponent implements AfterViewInit {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  @ViewChildren('overlayPanel') overlayPanels!: OverlayPanel[];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.hideOverlayPanels();
  }

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        this.hideOverlayPanels();
      });
  }

  logout() {
    this.authService.logout();
  }

  hideOverlayPanels() {
    if (this.overlayPanels) {
      this.overlayPanels.forEach((overlayPanel) => {
        overlayPanel.hide();
      });
    }
  }
}
