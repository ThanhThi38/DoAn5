import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ScriptService} from 'src/app/libs/script.service';
import {PaymentMethodService} from "../../services/payment-method.service";
import {LazyLoadEvent, PrimeNGConfig, MessageService} from "primeng/api";
import {environment} from "../../../environments/environment";
import {FileService} from "../../libs/file.service";
import {FileUpload} from 'primeng/fileupload';

declare var $: any;

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
  providers: [MessageService]
})
export class PaymentMethodComponent extends ScriptService implements OnInit {
  @ViewChild(FileUpload, {static: false}) file: FileUpload
  list = [];
  totalRecords: number;
  loading: boolean;
  form: FormGroup;
  first = 0;
  rows = 10;
  image: string;
  aoe: boolean;
  submitted: boolean;

  constructor(
    injector: Injector,
    private paymentMethodService: PaymentMethodService,
    private primeConfig: PrimeNGConfig,
    private messageService: MessageService,
    private fileService: FileService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    //Load icon
    this.loading = true;
    this.primeConfig.ripple = true;

    //Load script
    let elem = document.getElementsByClassName('script');
    if (elem.length != undefined) {
      for (var i = elem.length - 1; 0 <= i; i--) {
        elem[i].remove();
      }
    }
    this.loadScripts();

    //Validation
    this.form = new FormGroup({
      'id': new FormControl(),
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250)
      ]),
      'description': new FormControl('', [
        Validators.required,
        Validators.maxLength(250)
      ])
    })

    //Load data
    this.loadData({first: this.first, rows: this.rows});
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.first = event.first;
    this.rows = event.rows;
    setTimeout(() => {
      this.paymentMethodService.getPage(this.first, this.rows).subscribe((res: any) => {
        this.list = res.list;
        this.totalRecords = res.total;
        this.loading = false;
      })
    }, 1000)
  }

  showModal() {
    $("#largeModal").modal("show");
    this.form.reset();
    this.file.clear();
  }

  create() {
    this.showModal();
    this.aoe = true;
  }

  edit(id) {
    this.showModal();
    this.aoe = false;
    this.paymentMethodService.edit(id).subscribe((data: any) => {
      this.image = data.image;
      this.form.patchValue({
        id: data.id,
        name: data.name,
        description: data.description
      });
    }, err => {
      console.log(err);
      this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.aoe == true) {
      let payment_method = {
        name: this.form.value.name,
        description: this.form.value.description,
        image: undefined
      }
      this.fileService.getEncodeFromImage(this.file.files[0]).subscribe(data => {
        if (data != null) {
          payment_method.image = data;
        }

        this.paymentMethodService.create(payment_method).subscribe((res: any) => {
          this.submitted = false;
          $("#largeModal").modal("hide");
          this.loadData({first: this.first, rows: this.rows});
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: res.message
          });
        }, err => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
        })
      })
    } else {
      this.fileService.getEncodeFromImage(this.file.files[0]).subscribe(data => {
        if (data != null) {
          this.form.value.image = data;
        }
        this.paymentMethodService.update(this.form.value.id, this.form.value).subscribe((res:any) => {
          this.submitted = false;
          $("#largeModal").modal("hide");
          this.loadData({first: this.first, rows: this.rows});
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: res.message
          });
        }, err => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
        })
      })
    }
  }


  delete(id) {
    if (confirm("Bạn muốn xóa thanh toán này?")) {
      this.paymentMethodService.delete(id).subscribe((res:any) => {
        this.messageService.add({severity: 'success', summary: 'Thành công!', detail: res.message});
        this.loadData({first: this.first, rows: this.rows});
      }, err => {
        console.log(err);
        this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
      })
    }
  }

}
