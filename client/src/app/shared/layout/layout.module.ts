import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { DrawerModule } from 'primeng/drawer';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { FooterComponent } from './components/footer.component';
import { LayoutComponent } from './components/layout.component';
import { MenuComponent } from './components/menu.component';
import { MenuitemComponent } from './components/menuitem.component';
import { SidebarComponent } from './components/sidebar.component';
import { TopBarComponent } from './components/topbar.component';
import { ConfigModule } from './config/config.module';

@NgModule({ declarations: [
        MenuitemComponent,
        TopBarComponent,
        FooterComponent,
        MenuComponent,
        SidebarComponent,
        LayoutComponent,
    ],
    exports: [LayoutComponent], imports: [CommonModule,
        RouterModule,
        FormsModule,
        InputTextModule,
        DrawerModule,
        BadgeModule,
        RadioButtonModule,
        ToggleSwitchModule,
        RippleModule,
        PopoverModule,
        ButtonModule,
        SharedModule,
        ConfigModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class LayoutModule {}
