import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router'
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {
  }
  canActivate() {
    // const user = JSON.parse(localStorage.getItem("jwt"));
    // if (user.token && !this.jwtHelper.isTokenExpired(user.token)) {
    //   return true;
    // }
    // this.router.navigate(["/auth/login"]);
    return true;
  }
}
