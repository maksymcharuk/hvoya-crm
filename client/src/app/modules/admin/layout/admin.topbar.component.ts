import { MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { filter } from 'rxjs';

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { LayoutService } from '@shared/layout/services/layout.service';
import { AuthService } from '@shared/services/auth.service';
import { NotificationsService } from '@shared/services/notifications.service';

@Component({
  selector: 'admin-topbar',
  templateUrl: './admin.topbar.component.html',
})
export class AdminTopBarComponent implements AfterViewInit {
  items!: MenuItem[];
  uncheckedNotifications$ = this.notificationsService.notificationsNumber$;

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
    private notificationsService: NotificationsService,
  ) { }

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
