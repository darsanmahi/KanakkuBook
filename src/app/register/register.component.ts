import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerform : FormGroup;

  constructor( private authservice : AuthenticationService,private formbuilder: FormBuilder, private router: Router ) {
    this.registerform = this.formbuilder.group({
      email: ['',Validators.required],
      password : ['',Validators.required]
    });
   }

  ngOnInit(): void {
  }

  register(){
    const email = this.registerform.value.email;
    const pword = this.registerform.value.password;
    this.registerform.reset();
    this.authservice.RegisterUser(email,pword)
    .then((a) => {
      this.authservice.SignIn(email,pword)
      .then((a) => {
        this.router.navigate(['/storename']);
      });
    }).catch((err) => {
      alert(err.Message)
    });
  }

}
