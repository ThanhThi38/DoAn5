import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main.component';
import { OrderComponent } from './order/order.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'product', component: ProductComponent },
      { path: 'user', component: UserComponent },
      { path: 'payment-method', component: PaymentMethodComponent },
      { path: 'order', component: OrderComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
