import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeService } from '../services/home.service';

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private cartSubject = new BehaviorSubject("init");
    private current = this.cartSubject.asObservable();
    cartModel = {
        total: 0,
        quantity: 0,
        listCart: []
    };

    constructor(private homeService: HomeService) {
    }

    input(cmd) {
        this.cartSubject.next(cmd);
    }

    output() {
        return this.current;
    }

    loadCart() {
        this.cartModel = {
            total: 0,
            quantity: 0,
            listCart: []
        };
        this.homeService.getCart().subscribe((data: any) => {
            for (let i = 0; i < data.length; i++) {
                this.cartModel.total += (data[i].products.price - (data[i].products.price * data[i].products.sale / 100) + data[i].products.options.price) * data[i].quantity;
                this.cartModel.quantity += data[i].quantity;
            }
            this.cartModel.listCart = data;
        })
    }

    removeCart() {
        this.cartModel.total = 0;
        this.cartModel.quantity = 0;
        this.cartModel.listCart = [];
    }

}