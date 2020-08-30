import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authservice.service';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.scss']
})
export class AddstockComponent implements OnInit {
  data: string;

  addstockform = this.fb.group({
    name: ['', Validators.required],
    quantity: [0, Validators.required]
  });
  constructor(private authservice: AuthenticationService, private router: Router, private auth: AngularFireAuth,
              private db: AngularFireDatabase, private fb: FormBuilder, private snackbar: MatSnackBar) {
      this.auth.authState.subscribe((user) => {
        if (user) {
          this.db.database.ref('users/' + user.uid + '/Store/Storename')
          .once('value', (snapshot) => {
            this.data = snapshot.val();
          })
        }
      });
  }

  ngOnInit(): void {
  }

  addStock(): void{
      let itemname = this.addstockform.value.name;
      let itemquan = this.addstockform.value.quantity;
      this.auth.authState.subscribe((user) => {
        if (user){
          this.db.database.ref('users/' + user.uid + '/Stock/' + itemname).set({
            Available: itemquan,
            Sold: 0,
            Total: itemquan
          })
          .then(() => {
            this.snackbar.open(`Stock of ${itemname} added`, 'Ok', {
              duration: 2000,
            });
          })
          .then(() => {
            this.addstockform.reset(this.addstockform.value);
          });
        }
      })
  }

  logout() {
    this.authservice.SignOut().then((a) => {
      this.router.navigate(['/login']);
    });
  }

}
