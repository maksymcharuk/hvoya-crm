import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AbilityModule } from '@casl/angular';

import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    AbilityModule,
    MenuModule,
    PanelMenuModule,
    InputTextModule,
    BadgeModule,
  ],
  exports: [RouterModule],
  providers: [],
})
export class DashboardModule {}
