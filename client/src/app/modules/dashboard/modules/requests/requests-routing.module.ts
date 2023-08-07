import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestListComponent } from './pages/request-list/request-list.component';
import { RequestCreateComponent } from './pages/request-create/request-create.component';
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
    path: 'return-request/:number',
    component: ReturnRequestViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsRoutingModule { }
