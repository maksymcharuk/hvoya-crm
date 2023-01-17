import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

import { LayoutConfigModule } from '@shared/layout/layout-config.module';

import { AdminMenuComponent } from './admin.menu.component';
import { AdminMenuitemComponent } from './admin.menuitem.component';
import { AdminTopBarComponent } from './admin.topbar.component';
import { AdminFooterComponent } from './admin.footer.component';
import { AdminSidebarComponent } from './admin.sidebar.component';
import { AdminLayoutComponent } from './admin.layout.component';

@NgModule({
  declarations: [
    AdminMenuitemComponent,
    AdminTopBarComponent,
    AdminFooterComponent,
    AdminMenuComponent,
    AdminSidebarComponent,
    AdminLayoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    OverlayPanelModule,
    RouterModule,
    LayoutConfigModule,
    ButtonModule,
  ],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule { }
