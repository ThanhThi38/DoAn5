import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';

const baseUrl = environment.apiUrl + "category/";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(baseUrl);
  }

  getPage(first, rows) {
    return this._http.get(baseUrl + "get-page/" + first + "/" + rows);
  }

  edit(id) {
    return this._http.get(baseUrl + id);
  }

  update(id, category) {
    return this._http.put(baseUrl + id, category, { headers: environment.headerOptions });
  }

  create(category) {
    return this._http.post(baseUrl, category);
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
