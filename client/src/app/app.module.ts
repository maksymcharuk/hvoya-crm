import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import Aura from '@primeuix/themes/aura';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AblePipe } from '@casl/angular';

import { AppAbility } from '@shared/interfaces/casl.interface';
import { PoliciesService } from '@shared/services/policies.service';
import { SharedModule } from '@shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastModule,
        AblePipe,
        SharedModule], providers: [
        MessageService,
        {
            provide: AppAbility,
            useFactory: (policiesService: PoliciesService) => {
                return policiesService.build();
            },
            deps: [PoliciesService],
        },
        provideHttpClient(withInterceptorsFromDi()),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
    ] })
export class AppModule { }
