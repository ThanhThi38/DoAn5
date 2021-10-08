import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {HomeService} from "../../services/home.service";

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css'],
  providers: [MessageService]
})
export class ChangePassComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  customer:any;

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password_2: ['', Validators.required]
    }, {
      validator: this.confirm_password_validate('password', 'password_2')
    })

    this.form.controls.email.disable();
    this.customer = JSON.parse(localStorage.getItem("customer"));
    this.form.patchValue({
      email: this.customer.email
    })
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

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.homeService.changePass(this.customer.id, {password:this.form.value.password}).subscribe((res:any) => {
      this.submitted = false;
      this.messageService.add({severity: 'success', summary: "Thành công", detail: res.message});
      this.form.patchValue({
        password: '',
        password_2: ''
      });
    }, err => {
      console.log(err);
      this.messageService.add({severity: 'error', summary: "Thất bại", detail: err.error});
    })

  }

  showBtn() {
    var x = this.el.nativeElement.querySelector("[formcontrolname='password']");
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  showPass() {
    var x = this.el.nativeElement.querySelector("[formcontrolname='password_2']");
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

}
