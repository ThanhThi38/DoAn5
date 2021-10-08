import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  form: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
    })
  }

  login() {
    this.invalidLogin = true;
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value).subscribe((response: any) => {
      localStorage.setItem("jwt", JSON.stringify(response));
      this.invalidLogin = false;
      location.replace("/");
      // this.router.navigate(["/admin"]);
    }, err => {
      console.log(err)
      this.messageService.add({ severity: 'error', summary: 'Thất bại!', detail: err.error });
    });
  }


}
