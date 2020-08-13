import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  constructor(private authservice: AuthenticationService, private formbuilder: FormBuilder, private router: Router) {
    this.loginform = this.formbuilder.group({
      email : ['',Validators.required],
      password : ['',Validators.required]
    });
  }

  ngOnInit(): void {}

  login() {
    const email = this.loginform.value.email;
    const pword = this.loginform.value.password;
    this.loginform.reset();
    this.authservice.SignIn(email,pword)
      .then((a) => {
        this.router.navigate(['displaystore']);
      });
  }
}
