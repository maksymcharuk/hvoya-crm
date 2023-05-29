import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { UsersListComponent } from './components/users-list/users-list.component';
import { UserComponent } from './pages/user/user.component';
import { UsersListPageComponent } from './pages/users-list/users-list-page.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [UsersListPageComponent, UsersListComponent, UserComponent],
  imports: [
    UsersRoutingModule,
    CommonModule,
    SharedModule,
    SkeletonModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    AbilityModule,
    ConfirmDialogModule,
    TabViewModule,
  ],
  providers: [ConfirmationService],
})
export class UsersModule {}
