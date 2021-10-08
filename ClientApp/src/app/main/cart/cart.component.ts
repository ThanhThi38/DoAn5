import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/libs/cart.service';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [MessageService]
})
export class CartComponent implements OnInit {
  total: number;
  quantity: number;
  listCart: any[];

  constructor(private homeService: HomeService, private cartService: CartService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getData();
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

  createImg = (nameFile: string) => {
    return environment.urlImage + nameFile;
  }

  changeQuantity(id, quantity) {
    let cart = {
      id: id,
      quantity: Number(quantity)
    }
    if (cart.quantity == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo!', detail: 'Số lượng sản phẩm nhỏ hơn 1!' });
    } else {
      this.homeService.changeQuantity(cart).subscribe((data: number) => {
        this.getData();
        this.cartService.loadCart();
      });
    }
  }

  removeItem(id) {
    this.homeService.removeItem(id).subscribe((data: any) => {
      this.getData();
      this.cartService.loadCart();
    })
  }

}
