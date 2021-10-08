import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const baseUrl = environment.apiUrl + "paymentmethod/"

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(baseUrl);
  }

  getPage(first, rows) {
    return this._http.get(baseUrl + "get-page/" + first + "/" + rows);
  }

  create(payment_method) {
    return this._http.post(baseUrl, payment_method);
  }

  edit(id) {
    return this._http.get(baseUrl + id);
  }

  update(id, payment_method) {
    return this._http.put(baseUrl + id, payment_method);
  }

  delete(id) {
    return this._http.delete(baseUrl + id);
  }
}
