import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ScriptService} from 'src/app/libs/script.service';
import {UserService} from "../../services/user.service";
import {LazyLoadEvent, PrimeNGConfig, MessageService} from "primeng/api";
import {FileUpload} from 'primeng/fileupload';
import {FileService} from 'src/app/libs/file.service';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService]
})
export class UserComponent extends ScriptService implements OnInit {
  @ViewChild(FileUpload, {static: false}) file: FileUpload
  list = [];
  totalRecords: number;
  cols: any[];
  loading: boolean;
  form: FormGroup;
  first = 0;
  rows = 10;
  aoe: boolean;
  image: string;
  submitted: boolean;

  constructor(
    injector: Injector,
    private userService: UserService,
    private primeConfig: PrimeNGConfig,
    private messageService: MessageService,
    private fileService: FileService,
    private formBuilder: FormBuilder
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
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(70), Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern('^(0)[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password_2: ['', Validators.required]
    }, {
      validator: this.confirm_password_validate('password', 'password_2')
    })

    //Load data
    this.loadData({first: this.first, rows: this.rows});
  }

  confirm_password_validate(pass: string, pass_confirm: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[pass];
      const matchingControl = formGroup.controls[pass_confirm];

      if (matchingControl.errors && !matchingControl.errors.confirm_password) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({confirm_password: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  loadData(event: LazyLoadEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.loading = true;
    setTimeout(() => {
      this.userService.getPage(this.first, this.rows).subscribe((res: any) => {
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
    this.userService.edit(id).subscribe((data: any) => {
      this.image = data.image;
      this.form.patchValue({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    }, err => {
      console.log(err)
      this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.aoe == true) {
      let user = {
        name: this.form.value.name,
        email: this.form.value.email,
        phone: this.form.value.phone,
        password: this.form.value.password,
        image: null
      }
      this.fileService.getEncodeFromImage(this.file.files[0]).subscribe(data => {
        if (data != null) {
          user.image = data;
        }
        this.userService.create(user).subscribe((res:any) => {
          this.submitted = false
          $("#largeModal").modal("hide");
          this.loadData({first: this.first, rows: this.rows});
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: res.message
          });
        }, err => {
          console.log(err)
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
        })
      })
    } else {
      this.fileService.getEncodeFromImage(this.file.files[0]).subscribe(data => {
        if (data != null) {
          this.form.value.image = data;
        }
        this.userService.update(this.form.value.id, this.form.value).subscribe((res:any) => {
          $("#largeModal").modal("hide");
          this.loadData({first: this.first, rows: this.rows});
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công!',
            detail: res.message
          });
        }, err => {
          console.log(err)
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
        })
      })
    }
  }

  delete(id) {
    if (confirm("Bạn muốn xóa tài khoản này?")) {
      this.userService.delete(id).subscribe((res:any) => {
        this.messageService.add({severity: 'success', summary: 'Thành công!', detail: res.message});
        this.loadData({first: this.first, rows: this.rows});
      }, err => {
        console.log(err)
        this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
      })
    }
  }
}
