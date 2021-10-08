import { Component, OnInit } from '@angular/core';
import {HomeService} from "../../services/home.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup} from "@angular/forms";

declare var $:any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  listStatus = [
    { id: 1, name: "Chưa thanh toán" },
    { id: 2, name: "Đang xử lý" },
    { id: 3, name: "Đang giao hàng" },
    { id: 4, name: "Bị hủy" },
    { id: 5, name: "Hoàn thành" },
  ];
  first = 0;
  rows = 5;
  totalRecords: number;
  listOrder = [];
  listProduct = [];
  form: FormGroup;
  detail:any;

  constructor(
    private homeService: HomeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadData({rows: this.rows, first: this.first});

    this.form = this.formBuilder.group({
      name: [{value: '', disabled: true}],
      phone: [{value: '', disabled: true}],
      address: [{value: '', disabled: true}]
    })
  }

  loadData(event) {
    this.first = event.first;
    this.rows = event.rows;
    let customer = JSON.parse(localStorage.getItem("customer"));
    this.homeService.getOrder(customer.id, this.first, this.rows).subscribe((res:any) => {
      this.listOrder = res.list;
      this.totalRecords = res.total;
    })
  }

  showDetail(id) {
    $("#myModal").modal("show");
    this.homeService.showHistory(id).subscribe((res:any) => {
      this.listProduct = res.detailOrders;
      console.log(res)
      this.detail = res;
      this.form.patchValue({
        name: res.shipping.name,
        phone: res.shipping.phone,
        address: res.shipping.address
      })
    })
  }

  createImg(path) {
    return environment.urlImage + path;
  }

}
