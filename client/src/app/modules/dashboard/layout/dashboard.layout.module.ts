import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

import { LayoutConfigModule } from '@shared/layout/layout-config.module';
import { CartModule } from '../modules/cart/cart.module';

import { DashboardMenuComponent } from './dashboard.menu.component';
import { DashboardMenuitemComponent } from './dashboard.menuitem.component';
import { DashboardTopBarComponent } from './dashboard.topbar.component';
import { DashboardFooterComponent } from './dashboard.footer.component';
import { DashboardSidebarComponent } from './dashboard.sidebar.component';
import { DashboardLayoutComponent } from './dashboard.layout.component';

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
  ],
  exports: [DashboardLayoutComponent],
})
export class DashboardLayoutModule {}
