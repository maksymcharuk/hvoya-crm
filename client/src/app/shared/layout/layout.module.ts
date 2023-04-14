import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    OverlayPanelModule,
    ButtonModule,
    SharedModule,
    ConfigModule,
  ],
  declarations: [
    MenuitemComponent,
    TopBarComponent,
    FooterComponent,
    MenuComponent,
    SidebarComponent,
    LayoutComponent,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
