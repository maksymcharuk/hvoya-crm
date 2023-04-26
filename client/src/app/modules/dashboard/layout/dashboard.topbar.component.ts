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
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';

import { CartService } from '../modules/cart/services/cart/cart.service';
import { UserBalanceService } from '../modules/balance/services/user-balance.service';

@Component({
  selector: 'dashboard-topbar',
  templateUrl: './dashboard.topbar.component.html',
})
export class DashboardTopBarComponent implements AfterViewInit {
  items!: MenuItem[];
  cartItemsNumber$ = this.cartService.cartItemsNumber$;
  balance$ = this.userBalance.balance$;

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  @ViewChildren('overlayPanel') overlayPanels!: OverlayPanel[];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.hideOverlayPanels();
  }

  notificationsList: NotificationEntity[] = [];
  uncheckedNotifications: string = '0';

  constructor(
    public layoutService: LayoutService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private userBalance: UserBalanceService,
    private notificationsService: NotificationsService,
  ) { }

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        this.hideOverlayPanels();
      });
    this.getNotifications();
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

  getNotifications() {
    this.notificationsService.getNotifications()
      .subscribe((notifications: NotificationEntity[]) => {
        this.notificationsList = notifications;
        this.uncheckedNotifications = this.notificationsList.filter((notification) => !notification.checked).length.toString();
      });
  }

  checkNotification(notification: NotificationEntity) {
    if (!notification.checked) {
      this.notificationsService.checkNotification(notification.id)
        .subscribe((notifications: NotificationEntity[]) => {
          this.notificationsList = notifications;
          this.uncheckedNotifications = this.notificationsList.filter((notification) => !notification.checked).length.toString();
        });
    }
  }
}
