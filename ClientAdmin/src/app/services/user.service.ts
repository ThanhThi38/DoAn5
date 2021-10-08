import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';

const baseUrl = environment.apiUrl + "user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(baseUrl);
  }

  getPage(first, rows) {
    return this._http.get(baseUrl + "get-page/" + first + "/" + rows);
  }

  create(user) {
    return this._http.post(baseUrl, user);
  }

  edit(id) {
    return this._http.get(baseUrl + id);
  }

  update(id, user) {
    return this._http.put(baseUrl + id, user);
  }

  delete(id) {
    return this._http.delete(baseUrl + id);
  }
}
