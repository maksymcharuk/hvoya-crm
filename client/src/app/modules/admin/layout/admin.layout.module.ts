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

import { LayoutConfigModule } from '@shared/layout/layout-config.module';
import { SharedModule } from '@shared/shared.module';

import { AdminFooterComponent } from './admin.footer.component';
import { AdminLayoutComponent } from './admin.layout.component';
import { AdminMenuComponent } from './admin.menu.component';
import { AdminMenuitemComponent } from './admin.menuitem.component';
import { AdminSidebarComponent } from './admin.sidebar.component';
import { AdminTopBarComponent } from './admin.topbar.component';

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
    SharedModule
  ],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule { }
