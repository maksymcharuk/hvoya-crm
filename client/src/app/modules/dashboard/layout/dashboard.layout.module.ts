import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LayoutConfigModule } from '@shared/layout/layout-config.module';
import { SharedModule } from '@shared/shared.module';

import { CartModule } from '../modules/cart/cart.module';
import { DashboardFooterComponent } from './dashboard.footer.component';
import { DashboardLayoutComponent } from './dashboard.layout.component';
import { DashboardMenuComponent } from './dashboard.menu.component';
import { DashboardMenuitemComponent } from './dashboard.menuitem.component';
import { DashboardSidebarComponent } from './dashboard.sidebar.component';
import { DashboardTopBarComponent } from './dashboard.topbar.component';
import { BalanceModule } from '../modules/balance/balance.module';

@NgModule({
  declarations: [
    DashboardMenuitemComponent,
    DashboardTopBarComponent,
    DashboardFooterComponent,
    DashboardMenuComponent,
    DashboardSidebarComponent,
    DashboardLayoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    OverlayPanelModule,
    RouterModule,
    LayoutConfigModule,
    ButtonModule,
    CartModule,
    SharedModule,
    BalanceModule,
    VirtualScrollerModule,
  ],
  exports: [DashboardLayoutComponent],
})
export class DashboardLayoutModule { }
