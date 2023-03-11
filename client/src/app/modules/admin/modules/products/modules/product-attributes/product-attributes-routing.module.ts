import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductColorsComponent } from './pages/product-colors/product-colors.component';
import { ProductAttributesComponent } from './product-attributes.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'colors',
  },
  {
    path: '',
    component: ProductAttributesComponent,
    children: [
      {
        path: 'colors',
        component: ProductColorsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductAttributesRoutingModule {}
