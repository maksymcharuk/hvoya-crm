import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutModule } from './layout/admin.layout.module';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [AdminComponent, AdminDashboardComponent],
  imports: [CommonModule, AdminRoutingModule, AdminLayoutModule, SharedModule],
})
export class AdminModule { }
