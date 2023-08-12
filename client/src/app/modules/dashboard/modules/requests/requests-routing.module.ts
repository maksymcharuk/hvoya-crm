import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestCreateComponent } from './pages/request-create/request-create.component';
import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';

const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
  },
  {
    path: 'create',
    component: RequestCreateComponent,
  },
  {
    path: 'return-requests/:number',
    component: ReturnRequestViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsRoutingModule {}
