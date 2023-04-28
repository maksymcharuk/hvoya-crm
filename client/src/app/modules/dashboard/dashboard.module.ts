import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AbilityModule } from '@casl/angular';

import { LayoutModule } from '@shared/layout/layout.module';
import { SharedModule } from '@shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BalanceModule } from './modules/balance/balance.module';
import { CartModule } from './modules/cart/cart.module';
import { DashboardMainComponent } from './pages/main/main.component';

@NgModule({
  declarations: [DashboardComponent, DashboardMainComponent],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    AbilityModule,
    MenuModule,
    PanelMenuModule,
    InputTextModule,
    BadgeModule,
    ButtonModule,
    LayoutModule,
    OverlayPanelModule,
    BalanceModule,
    CartModule,
    SharedModule,
  ],
})
export class DashboardModule {}
