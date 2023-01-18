import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AbilityModule } from '@casl/angular';
import { PureAbility } from '@casl/ability';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppAbility } from '@shared/roles/ability';

import { HttpExceptionInterceptor } from '@shared/interceptors/http-exception.interceptor';
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';

import { PoliciesService } from '@shared/services/policies.service';
import { UserService } from '@shared/services/user.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    AbilityModule,
  ],
  providers: [
    MessageService,
    PoliciesService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility, useExisting: AppAbility },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
