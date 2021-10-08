import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import { ScriptService } from "../../libs/script.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends ScriptService implements OnInit {
  list = [];
  totalRecords: number;
  rows = 12;
  id: string;
  sort = "default";

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
      this.id = params.get('id');
      this.homeService.search(this.id, 0, this.rows, this.sort).subscribe((data: any) => {
        this.totalRecords = data.length;
      })
    })
    this.loadPage(0, this.rows);
  }

  loadPage(first, rows) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.homeService.search(id, first, rows, this.sort).subscribe((data: any) => {
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
      this.homeService.search(id, 0, this.rows, val).subscribe((data: any) => {
        this.list = data;
      })
    })
  }

}
