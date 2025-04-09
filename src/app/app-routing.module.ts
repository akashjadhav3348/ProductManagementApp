import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllProductComponent } from './components/all-product/all-product.component';

const routes: Routes = [
  
  { 
    path: '',component:DashboardComponent
  },
  { 
    path: 'products', component: ProductListComponent 
  },
  { 
    path: 'add-product', component: ProductFormComponent 
  },
  {
    path:'add-category',component:CategoriesComponent
  },
  {
    path:'all-product',component:AllProductComponent
  },
  { 
    path: 'product/:id', component: AllProductComponent 
  },
  {
    path:'dashboard',component:DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
