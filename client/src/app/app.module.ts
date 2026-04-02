import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { provideA2UI } from '@a2ui/angular';

import { HVOYA_CATALOG, HVOYA_THEME } from './modules/admin/catalog/hvoya-catalog';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AblePipe } from '@casl/angular';

import { AppAbility } from '@shared/interfaces/casl.interface';
import { PoliciesService } from '@shared/services/policies.service';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const HvoyaPreset = definePreset(Aura, {
  primitive: {
    hvoya: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a2f0cc',
      300: '#6edcaa',
      400: '#40c27f',
      500: '#24a060',
      600: '#1a7d4a',
      700: '#145c37',
      800: '#0e3f27',
      900: '#08271a',
      950: '#041610',
    },
  },
  semantic: {
    primary: {
      50: '{hvoya.50}',
      100: '{hvoya.100}',
      200: '{hvoya.200}',
      300: '{hvoya.300}',
      400: '{hvoya.400}',
      500: '{hvoya.500}',
      600: '{hvoya.600}',
      700: '{hvoya.700}',
      800: '{hvoya.800}',
      900: '{hvoya.900}',
      950: '{hvoya.950}',
    },
  },
});

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule,
    AblePipe,
    SharedModule,
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
    providePrimeNG({
      theme: { preset: HvoyaPreset, options: { darkModeSelector: '.app-dark' } },
    }),
    provideA2UI({ catalog: HVOYA_CATALOG, theme: HVOYA_THEME }),
  ],
})
export class AppModule {}
