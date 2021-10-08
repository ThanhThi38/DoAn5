import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from "@angular/forms";
import { ToastModule } from 'primeng/toast';
import { JwtModule } from "@auth0/angular-jwt";

export function tokenGetter() {
  let user = JSON.parse(localStorage.getItem("jwt"));
  return user ? user.token : null;
}

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MainModule } from './main/main.module';
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './auth/login/login.component';
import { Page404Component } from './auth/page404/page404.component';
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [environment.Domain],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
