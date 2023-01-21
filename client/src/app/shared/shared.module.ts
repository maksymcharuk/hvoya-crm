import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VerticalMenuComponent } from './components/vertical-menu/vertical-menu.component';

@NgModule({
  declarations: [VerticalMenuComponent],
  imports: [CommonModule, RouterModule],
  exports: [VerticalMenuComponent],
})
export class SharedModule {}
