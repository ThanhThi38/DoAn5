import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from "./checkout/checkout.component";
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { ListProductComponent } from './list-product/list-product.component';
import { MainComponent } from './main.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../guards/auth.guard';
import { SearchComponent } from './search/search.component';
import {ChangePassComponent} from "./change-pass/change-pass.component";
import {HistoryComponent} from "./history/history.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'trang-chu', component: HomeComponent },
      { path: 'danh-sach/:id', component: ListProductComponent },
      { path: 'chi-tiet/:id', component: ProductDetailComponent },
      { path: 'gio-hang', component: CartComponent },
      { path: 'thanh-toan', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'dang-nhap', component: LoginComponent },
      { path: 'dang-ky', component: RegisterComponent },
      { path: 'tim-kiem/:id', component: SearchComponent },
      { path: 'doi-mat-khau', component: ChangePassComponent, canActivate: [AuthGuard]},
      { path: 'lich-su-mua-hang', component: HistoryComponent, canActivate: [AuthGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class MainRoutingModule { }
