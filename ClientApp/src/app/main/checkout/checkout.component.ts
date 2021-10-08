import { Component, Injector, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/libs/cart.service';
import { ScriptService } from 'src/app/libs/script.service';
import { HomeService } from 'src/app/services/home.service';
import {Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService]
})
export class CheckoutComponent extends ScriptService implements OnInit {
  listCity = [];
  listDistrict = [];
  listCommune = [];
  total: number;
  quantity: number;
  listCart = [];
  listPayment = [];
  city: string;
  district: string;
  commune: string;
  form: FormGroup;
  submitted: boolean;

  constructor(
    injector: Injector,
    private homeService: HomeService,
    private cartService: CartService,
    private messageService: MessageService,
    private router: Router
  ) {
    super(injector)
  }

  ngOnInit(): void {
    let elem = document.getElementsByClassName('script');
    if (elem.length != undefined) {
      for (var i = elem.length - 1; 0 <= i; i--) {
        elem[i].remove();
      }
    }

    this.loadScripts();
    this.getData();
    this.getCity();
    this.getPayment();

    this.form = new FormGroup({
      name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(250)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^(0)[0-9]{9}$')
      ]),
      address: new FormControl('', [
          Validators.required
      ]),
      paymentId: new FormControl()
    })
  }

  getData() {
    this.total = 0;
    this.quantity = 0;
    this.listCart = [];
    this.homeService.getCart().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.total += (data[i].products.price - (data[i].products.price * data[i].products.sale / 100) + data[i].products.options.price) * data[i].quantity;
        this.quantity += data[i].quantity;
      }
      this.listCart = data;
    })
  }

  getCity() {
    this.homeService.getCity().subscribe((data: any) => {
      this.listCity = data;
    })
  }

  getPayment() {
    this.homeService.getPayment().subscribe((data: any) => {
      this.listPayment = data;
      this.form.patchValue({ paymentId: this.listPayment[0].id })
    })
  }

  showCollapse(id) {
    this.form.patchValue({ paymentId: id })
    var collapse = document.getElementsByClassName("collapse");
    for (let i = 0; i < collapse.length; i++) {
      collapse[i].classList.remove("show");
    }
    document.getElementById("collapse" + id).classList.add("show");
  }

  getDistrict(name) {
    this.city = name;
    document.getElementById("huyen").classList.remove("disabled");
    for (let i = 0; i < this.listCity.length; i++) {
      if (this.listCity[i].name === name) {
        this.listDistrict = this.listCity[i].huyen;
      }
    }
  }

  getCommune(name) {
    this.district = name;
    document.getElementById("xa").classList.remove("disabled");
    for (let i = 0; i < this.listDistrict.length; i++) {
      if (this.listDistrict[i].name === name) {
        this.listCommune = this.listDistrict[i].xa;
      }
    }
  }

  getNameCommune(name) {
    this.commune = name;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid || this.listCart.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Giỏ hàng rỗng!' });
      return;
    }
    let customer = JSON.parse(localStorage.getItem("customer"));
    if (customer != null) {
      let order = {
        paymentId: this.form.value.paymentId,
        customerId: customer.id,
        shipping: {
          name: this.form.value.name,
          phone: this.form.value.phone,
          address: this.form.value.address + ", " + this.commune + ", " + this.district + ", " + this.city,
        }
      }
      this.homeService.addOrder(order).subscribe((data: any) => {
        this.cartService.input("load-cart");
        this.router.navigate(['/lich-su-mua-hang']);
        this.messageService.add({ severity: 'success', summary: 'Thành công!', detail: 'Đặt hàng thành công!' });
      })
    }
  }

}
