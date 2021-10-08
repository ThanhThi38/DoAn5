import { Component, ElementRef, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HomeService } from 'src/app/services/home.service';
import { Router } from "@angular/router";
import { CartService } from 'src/app/libs/cart.service';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  form: FormGroup;
  submitted: boolean;

  constructor(
    private el: ElementRef,
    private homeService: HomeService,
    private cartService: CartService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(70), Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    })
  }

  showBtn() {
    var x = this.el.nativeElement.querySelector("[formcontrolname='password']");
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let customer = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.homeService.login(customer).subscribe((data: any) => {
      const token = data.token;
      const customer = data.customer;
      localStorage.setItem("jwt", token);
      localStorage.setItem("customer", JSON.stringify(customer));
      this.invalidLogin = false;
      this.cartService.input("load-cart");
      this.router.navigate(["/trang-chu"]);
    }, err => {
      console.log(err);
      this.messageService.add({severity: 'error', summary: "Thất bại", detail: err.error});
    })
  }

}
