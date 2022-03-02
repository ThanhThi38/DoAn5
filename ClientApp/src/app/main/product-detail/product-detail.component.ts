import { Component, Injector, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import { ScriptService } from "../../libs/script.service";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/libs/cart.service';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [MessageService]
})
export class ProductDetailComponent extends ScriptService implements OnInit {
  product: any;
  related = [];
  customer: any;
  totalPrice = 0;
  submitted: boolean;

  form: FormGroup
  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService,
    private messageService: MessageService,
    private cartService: CartService
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

    this.form = new FormGroup({
      'quantity': new FormControl(1, [
        Validators.required,
        Validators.min(1)
      ]),
      'productId': new FormControl(),
      'optionName': new FormControl('', [
        Validators.required
      ])
    })

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.product = {};
      this.homeService.getDetail(id).subscribe((data: any) => {
        this.product = data;
        

        this.totalPrice = data.price - (data.price * data.sale / 100);
        this.form.patchValue({ 'productId': this.product.id });
      })
    })

  }

  createImg = (nameFile: string) => {
    return environment.urlImage + nameFile;
  }

  truncateChar(text: string): string {
    let charlimit = 3000;
    if(!text || text.length <= charlimit )
    {
        return text;
    }

    let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
    let shortened = without_html.substring(0, charlimit) + "...";
    return shortened;
  }

  viewLess() {
    let content = document.querySelector('#dtail');
    if (!content.classList.contains('show_less')) {
      content.classList.add('show_less');
    }
  }

  viewMore() {
    let content = document.querySelector('#dtail');
    if (content.classList.contains('show_less')) {
      content.classList.remove('show_less');
    }
  }

  addCart() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let token = localStorage.getItem("jwt");
    this.customer = JSON.parse(localStorage.getItem("customer"));
    if (this.customer == null || token == null) {
      this.router.navigate(["/dang-nhap"]);
    } else {
      let cart = {
        customerId: this.customer.id,
        productId: this.form.value.productId,
        quantity: this.form.value.quantity,
        optionName: this.form.value.optionName
      }

      this.homeService.addCart(cart).subscribe((data: any) => {
        this.submitted = false;
        this.cartService.input("load-cart");
        this.messageService.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã thêm vào giỏ hàng!' });
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại!', detail: 'Thêm vào giỏ hàng thất bại!' });
      })
    }
  }

  changePrice(priceOption: number) {
    this.totalPrice = 0;
    this.totalPrice += this.product.price - (this.product.price * this.product.sale / 100) + priceOption;
  }

  relatedOption: OwlOptions = {
    loop: true,
    dots: false,
    margin: 30,
    smartSpeed: 1500,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1,
        autoplay: true,
        smartSpeed: 500
      },
      480: {
        items: 2
      },
      768: {
        items: 3
      },
      992: {
        items: 4
      }
    },
    nav: true
  }

  thumbOption: OwlOptions = {
    loop: true,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    margin: 15,
    smartSpeed: 500,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 3,
        autoplay: true,
      },
      768: {
        items: 3
      },
      1200: {
        items: 4
      }
    }
  }
}
