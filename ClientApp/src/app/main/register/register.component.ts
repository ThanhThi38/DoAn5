import { Component, ElementRef, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;

  constructor(
    private el: ElementRef,
    private homeService: HomeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(70), Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern('^(0)[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      password_2: ['', Validators.required]
    }, {
      validator: this.confirm_password_validate('password', 'password_2')
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

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let customer = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      password: this.form.value.password
    }
    this.homeService.register(customer).subscribe(data => {
      this.submitted = false;
      this.router.navigate(["/dang-nhap"]);
    }, err => {
      console.log(err);
    })
  }

}
