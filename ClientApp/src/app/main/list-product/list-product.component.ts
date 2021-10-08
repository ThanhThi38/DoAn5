import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import { ScriptService } from "../../libs/script.service";
declare var $: any;
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent extends ScriptService implements OnInit {
  list = [];
  totalRecords: number;
  rows = 12;
  val = 0;
  maxVal: number;
  minVal: number;
  sort = "default";
  filterName = [];

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private homeService: HomeService
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

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.homeService.getList(id).subscribe((data: any) => {
        this.totalRecords = data.length;
        if (this.totalRecords != 0) {
          for (let i = 0; i < data.length; i++) {
            let arrName = [];
            arrName.push(data[i].name.split(" ")[0] + " " + data[i].name.split(" ")[1]);
            this.filterName.splice(0, this.filterName.length);
            for (let index = 0; index < arrName.length; index++) {
              if (!this.filterName.includes(arrName[index])) {
                this.filterName.push(arrName[index]);
              }
            }
          }
        }
      })
    })
    this.loadPage(0, this.rows);
  }

  loadPage(first, rows) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.homeService.getPage(id, first, rows, this.sort).subscribe((data: any) => {
        this.list = data;
      })
    })
  }

  paginate(event) {
    this.loadPage(event.first, event.rows);
  }

  createImg = (nameFile: string) => {
    return environment.urlImage + nameFile;
  }

  sortData(val) {
    this.sort = val;
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.homeService.getPage(id, 0, this.rows, val).subscribe((data: any) => {
        this.list = data;
      })
    })
  }

}
