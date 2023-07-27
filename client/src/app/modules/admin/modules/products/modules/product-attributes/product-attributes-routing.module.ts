import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductColorsComponent } from './pages/product-colors/product-colors.component';
import { ProductPackageSizesComponent } from './pages/product-package-sizes/product-package-sizes.component';
import { ProductSizesComponent } from './pages/product-sizes/product-sizes.component';
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
      {
        path: 'sizes',
        component: ProductSizesComponent,
      },
      {
        path: 'package-sizes',
        component: ProductPackageSizesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductAttributesRoutingModule {}
