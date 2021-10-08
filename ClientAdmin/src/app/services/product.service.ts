import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl + "product/"

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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

  update(id, product) {
    return this._http.put(baseUrl + id, product);
  }

  create(product) {
    return this._http.post(baseUrl, product);
  }

  delete(id) {
    return this._http.delete(baseUrl + id);
  }

  hide(id) {
    return this._http.post(baseUrl + "hide", {id: id});
  }

  show(id) {
    return this._http.post(baseUrl + "show", {id: id});
  }
}
