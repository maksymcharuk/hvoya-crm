import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DrawerModule } from 'primeng/drawer';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfigComponent } from './config.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    RadioButtonModule,
    ButtonModule,
    ToggleSwitchModule,
  ],
  declarations: [ConfigComponent],
  exports: [ConfigComponent],
})
export class ConfigModule {}
