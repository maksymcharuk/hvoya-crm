import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PopoverModule } from 'primeng/popover';
import { PanelMenuModule } from 'primeng/panelmenu';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AblePipe } from '@casl/angular';

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
    AblePipe,
    MenuModule,
    PanelMenuModule,
    InputTextModule,
    OverlayBadgeModule,
    ButtonModule,
    LayoutModule,
    PopoverModule,
    BalanceModule,
    CartModule,
    SharedModule,
  ],
})
export class DashboardModule {}
