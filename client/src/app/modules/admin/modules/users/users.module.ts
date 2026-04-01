import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AblePipe } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserComponent } from './pages/user/user.component';
import { UsersListPageComponent } from './pages/users-list/users-list-page.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UsersListPageComponent,
    UsersListComponent,
    UserComponent,
    UserListItemComponent,
  ],
  imports: [
    UsersRoutingModule,
    CommonModule,
    SharedModule,
    SkeletonModule,
    TableModule,
    SelectModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    AblePipe,
    ConfirmDialogModule,
    TabsModule,
    TextareaModule,
    DialogModule,
    TooltipModule,
    MultiSelectModule,
    ProgressBarModule,
  ],
  providers: [ConfirmationService],
})
export class UsersModule {}
