import { AbilityModule } from '@casl/angular';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { UserComponent } from './pages/user/user.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersListPageComponent } from './pages/users-list/users-list-page.component';


@NgModule({
  declarations: [
    UsersListPageComponent,
    UsersListComponent,
    UserComponent,
  ],
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
  ],
  providers: [
    ConfirmationService,
  ],
})
export class UsersModule { }
