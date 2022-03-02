import { Component, Injector, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import { ScriptService } from "../../libs/script.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends ScriptService implements OnInit {
  hotDeal = [];
  newProduct = [];
  featured = [];

  constructor(injector: Injector, private homeService: HomeService) {
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

    this.homeService.getProduct().subscribe((data: any) => {
      this.hotDeal = data.hotDeal;
      this.newProduct = data.newProduct;
      this.featured = data.featured;
    })
  }

  createImg = (nameFile: string) => {
    return environment.urlImage + nameFile;
  }

  hotDealOption: OwlOptions = {
    loop: true,
    nav: true,
    dots: false,
    smartSpeed: 1500,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    margin: 30,
    responsive: {
      0: {
        items: 1,
        autoplay: true,
        smartSpeed: 500
      },
      480: {
        items: 2
      },
      768: {
        items: 2
      },
      992: {
        items: 3
      },
      1200: {
        items: 4
      }
    }
  }



  quickView(id) {
    this.homeService.getDetail(id).subscribe((data: any) => {

    })
  }

}
