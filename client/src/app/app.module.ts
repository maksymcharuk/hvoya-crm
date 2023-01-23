import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AbilityModule } from '@casl/angular';
import { PureAbility } from '@casl/ability';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppAbility } from '@shared/roles/ability';

import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    AbilityModule,
    SharedModule,
  ],
  providers: [
    MessageService,
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility, useExisting: AppAbility },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
