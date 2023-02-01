import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbilityModule } from '@casl/angular';

import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';

import { SharedModule } from '@shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutModule } from './layout/dashboard.layout.module';
import { CartModule } from './modules/cart/cart.module';

import { DashboardComponent } from './dashboard.component';
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
