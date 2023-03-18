import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AbilityModule } from '@casl/angular';

import { AppAbility } from '@shared/interfaces/casl.interface';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    AbilityModule,
    SharedModule,
  ],
  providers: [
    MessageService,
    { provide: AppAbility, useValue: new AppAbility() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
