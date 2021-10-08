import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

const baseUrl = environment.apiUrl + "home/";

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  constructor(private _http: HttpClient) { }

  getCategory() {
    return this._http.get(baseUrl);
  }

  getProduct() {
    return this._http.get(baseUrl + "get-product");
  }

  getList(id) {
    return this._http.get(baseUrl + "list-product/" + id);
  }

  getPage(id, first, rows, sort) {
    return this._http.get(baseUrl + "get-page/" + id + "/" + first + "/" + rows + "/" + sort)
  }

  getDetail(id) {
    return this._http.get(baseUrl + "get-detail/" + id);
  }

  register(customer) {
    return this._http.post(baseUrl + "register", customer, { headers: environment.headerOptions });
  }

  login(customer) {
    return this._http.post(baseUrl + "login", customer, { headers: environment.headerOptions });
  }

  changePass(id, customer) {
    return this._http.put(baseUrl + "change-pass/" + id, customer);
  }

  search(id, first, rows, sort) {
    return this._http.get(baseUrl + "search/" + id + "/" + first + "/" + rows + "/" + sort);
  }

  addCart(cart) {
    return this._http.post(baseUrl + "add-cart", cart);
  }

  getCart() {
    let customer = JSON.parse(localStorage.getItem("customer"));
    return this._http.get(baseUrl + "get-cart/" + customer.id);
  }

  removeItem(id) {
    return this._http.delete(baseUrl + "remove-item/" + id)
  }

  changeQuantity(cart) {
    return this._http.post(baseUrl + "change-quantity", cart);
  }

  getCity() {
    return this._http.get("https://raw.githubusercontent.com/xuanvu99/DiaGioiHanhChinhVN/master/json/all.json");
  }

  getPayment() {
    return this._http.get(environment.apiUrl + "paymentmethod");
  }

  addOrder(order) {
    return this._http.post(baseUrl + "add-order", order);
  }

  getOrder(id, first, rows) {
    return this._http.get(baseUrl + "history/" + id + "/" + first + "/" + rows);
  }

  showHistory(id) {
    return this._http.get(baseUrl + "show-history/" + id);
  }
}
