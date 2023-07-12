import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '@shared/layout/layout.module';
import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersRatingComponent } from './components/users-rating/users-rating.component';

@NgModule({
  declarations: [AdminComponent, AdminDashboardComponent, UsersRatingComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    OverlayPanelModule,
    BadgeModule,
    LayoutModule,
    SharedModule,
    TableModule,
    SkeletonModule,
    ChartModule,
  ],
})
export class AdminModule {}
