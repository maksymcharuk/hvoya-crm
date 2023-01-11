import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AbilityModule } from '@casl/angular';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [RouterModule.forChild(routes), CommonModule, AbilityModule],
  exports: [RouterModule],
  providers: []
})
export class DashboardModule { }
