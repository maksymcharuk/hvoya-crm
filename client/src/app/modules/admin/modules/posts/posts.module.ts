import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { PostEffects } from './state/post.effects';
import { postsFeature } from './state/post.reducer';

@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PostsRoutingModule,
    SharedModule,
    PanelModule,
    MenuModule,
    ButtonModule,
    DialogModule,
    EditorModule,
    AbilityModule,
    CheckboxModule,
    PaginatorModule,
    ConfirmDialogModule,
    StoreModule.forFeature(postsFeature),
    EffectsModule.forFeature([PostEffects]),
  ],
  providers: [ConfirmationService],
})
export class PostsModule {}
