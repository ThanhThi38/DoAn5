import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';
import { RadioButtonModule } from "primeng/radiobutton";
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { OrderComponent } from './order/order.component';
import {GetImagePipe} from "../libs/get.image.pipe";
import {ColorPickerModule} from "primeng/colorpicker";

@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    ProductComponent,
    UserComponent,
    PaymentMethodComponent,
    OrderComponent,
    GetImagePipe
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    RadioButtonModule,
    ToastModule,
    FileUploadModule,
    InputSwitchModule,
    CKEditorModule,
    DropdownModule,
    ListboxModule,
    ColorPickerModule
  ]
})
export class MainModule { }
