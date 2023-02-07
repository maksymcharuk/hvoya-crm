import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardLayoutModule } from './layout/dashboard.layout.module';
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
    DashboardLayoutModule,
    CartModule,
    SharedModule,
  ],
  exports: [RouterModule],
  providers: [],
})
export class DashboardModule {}
