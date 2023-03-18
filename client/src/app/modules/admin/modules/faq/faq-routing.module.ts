import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingChangesGuard } from '@shared/guards/pending-changes/pending-changes.guard';

import { FaqComponent } from './faq.component';

const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    canDeactivate: [PendingChangesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqRoutingModule {}
