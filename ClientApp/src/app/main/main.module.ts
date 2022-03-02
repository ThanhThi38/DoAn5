import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { HistoryComponent } from './history/history.component';
import { SafePipe } from '../pipes/safe.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    ListProductComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
    ChangePassComponent,
    HistoryComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    ToastModule,
    RadioButtonModule
  ]
})
export class MainModule { }
