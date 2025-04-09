import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductFormComponent } from './components/product-form/product-form.component'; // ✅ Import the missing component
import { CommonModule } from '@angular/common';
import { AsideComponent } from './layout/aside/aside.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllProductComponent } from './components/all-product/all-product.component';
import { ProductDetailsComponentComponent } from './components/product-details-component/product-details-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; // for buttons
import { MatInputModule } from '@angular/material/input'; // for input fields
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailsComponent,
    NavbarComponent,
    CategoriesComponent,
    ProductFormComponent,
    AsideComponent,
    FooterComponent,
    DashboardComponent,
    AllProductComponent,
    ProductDetailsComponentComponent // ✅ Add it here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, // ✅ Keep this
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
