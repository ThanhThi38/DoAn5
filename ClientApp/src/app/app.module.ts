import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { environment } from 'src/environments/environment';
import { CartService } from './libs/cart.service';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule,
    ReactiveFormsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.Domain],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
