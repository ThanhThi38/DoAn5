import { Component, OnInit } from '@angular/core';
import { HomeService } from "../services/home.service";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { CartService } from '../libs/cart.service';

declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MessageService]
})
export class MainComponent implements OnInit {
  listCate = [];
  token: any;
  form: FormGroup;
  login: boolean;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private messageService: MessageService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    $('.drodown-show > a').on('click', function (e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        $('.drodown-show > a').removeClass('active').siblings('.dropdown').slideUp()
        $(this).removeClass('active').siblings('.dropdown').slideUp();
      } else {
        $('.drodown-show > a').removeClass('active').siblings('.dropdown').slideUp()
        $(this).addClass('active').siblings('.dropdown').slideDown();
      }
    });

    this.token = localStorage.getItem("jwt");
    if (this.token != null) {
      this.cartService.input("load-cart");
    } else {
      this.cartService.input("remove-cart")
    }

    this.cartService.output()
      .subscribe(cmd => {
        if (cmd == "load-cart") {
          this.getCart();
          this.login = true;
        } else if (cmd == "remove-cart") {
          this.login = false;
          this.cartService.removeCart();
        }
      })

    this.homeService.getCategory().subscribe((data: any) => {
      this.listCate = data;
    })

    this.form = new FormGroup({
      "key": new FormControl('', [
        Validators.required
      ])
    })
  }

  get total() {
    return this.cartService.cartModel.total;
  }

  get quantity() {
    return this.cartService.cartModel.quantity;
  }

  get listCart() {
    return this.cartService.cartModel.listCart;
  }

  search() {
    if (this.form.invalid) {
      return
    }
    this.router.navigate(['/tim-kiem', this.form.value.key]);
  }

  logout() {
    if (confirm("Bạn có muốn đăng xuất?")) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("customer");
      this.cartService.input("remove-cart");
      this.router.navigate(["/dang-nhap"]);
    }
  }

  getCart() {
    let token = localStorage.getItem("jwt");
    if (token != null) {
      this.cartService.loadCart();
    }
  }

  removeItem(id) {
    this.homeService.removeItem(id).subscribe((data: any) => {
      this.getCart();
      this.messageService.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã xoá khỏi giỏ hàng!' });
    })
  }

  createImg = (nameFile: string) => {
    return environment.urlImage + nameFile;
  }

}
