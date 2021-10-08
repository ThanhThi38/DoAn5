import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl + "order/"

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(baseUrl);
  }

  getPage(begin, end) {
    return this._http.get(baseUrl + "get-page/" + begin + "/" + end);
  }

  edit(id) {
    return this._http.get(baseUrl + id);
  }

  update(id, order) {
    return this._http.put(baseUrl + id, order);
  }

  create(order) {
    return this._http.post(baseUrl, order, { headers: environment.headerOptions });
  }

  delete(id) {
    return this._http.delete(baseUrl + id);
  }
}
