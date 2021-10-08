import { Component, Injector, OnInit } from '@angular/core';
import { DashboardService } from "../../libs/dashboard.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent extends DashboardService implements OnInit {

  constructor(injector: Injector) {
    super(injector)
  }

  ngOnInit(): void {
    let elem = document.getElementsByClassName('dashboard');
    if (elem.length != undefined) {
      for (var i = elem.length - 1; 0 <= i; i--) {
        elem[i].remove();
      }
    }
    this.loadScripts();
  }

}
