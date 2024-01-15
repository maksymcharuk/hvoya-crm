import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AbilityModule } from '@casl/angular';

import { environment } from '@environment/environment';
import { AppAbility } from '@shared/interfaces/casl.interface';
import { PoliciesService } from '@shared/services/policies.service';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    AbilityModule,
    SharedModule,
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    MessageService,
    {
      provide: AppAbility,
      useFactory: (policiesService: PoliciesService) => {
        return policiesService.build();
      },
      deps: [PoliciesService],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
