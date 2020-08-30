import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-displaystore',
  templateUrl: './displaystore.component.html',
  styleUrls: ['./displaystore.component.scss'],
})
export class DisplaystoreComponent implements OnInit {
  itemsRef: AngularFireList<any>;
  itemsRef1: AngularFireList<any>;
  data1: Observable<any> = null;
  data3: Observable<any> = null;
  data2: Array<string> = [];
  ischecked: boolean = false;
  data: string = '';

  addentryform: FormGroup;
  constructor(
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private authservice: AuthenticationService,
    private router: Router
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        const uid = user.uid;
        this.db.database
          .ref('users/' + uid + '/Store/Storename')
          .once('value', (snapshot) => {
            let d = snapshot.val();
            this.data = d;
          });
        this.itemsRef = this.db.list('users/' + uid + '/Customers');
        this.data1 = this.itemsRef
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
        this.itemsRef1 = this.db.list('users/' + user.uid + '/Stock');
        this.data3 = this.itemsRef1
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
      }
    });

    this.addentryform = this.formbuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      item: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  toggle() {
    if (this.ischecked) {
      this.ischecked = false;
    } else {
      this.ischecked = true;
    }
  }
  addentry() {
    const name = this.addentryform.value.name;
    const amt = this.addentryform.value.amount;
    const date = this.addentryform.value.date;
    const item = this.addentryform.value.item;
    const quan = this.addentryform.value.quantity;
    let prev_amt = 0;
    let prev_date = '';
    let PrevAvailStock = 0;
    let PrevSoldStock = 0;
    let PrevTotal = 0;
    console.log(amt);
    this.auth.authState.subscribe((user) => {
      if (user) {
        const userid = user.uid;
        this.db.database.ref('users/' + userid + '/Customers').push({
          CName: name,
        });
        this.db.database
          .ref('users/' + userid + '/History/' + name)
          .once('value', (snapshot) => {
            let data = snapshot.val();
            if (data) {
              prev_amt = data.Amount;
              prev_date = data.Date;
            }
          })
          .then((a) => {
            this.db.database
              .ref('users/' + userid + '/History/' + name)
              .set({
                Amount: prev_amt + amt,
                Date: prev_date + ',' + date,
              })
              .then((a) => {
                this.db.database.ref('users/' + user.uid + '/Stock/' + item)
                .once('value', (snapshot) => {
                  let val = snapshot.val();
                  PrevAvailStock = Number(val.Available);
                  PrevSoldStock = Number(val.Sold);
                  PrevTotal = Number(val.Total);
                })
                .then(() => {
                  let CurrentStock = PrevAvailStock - quan;
                  let CurrentTotal = PrevTotal - quan;
                  let CurrentSold = PrevSoldStock + quan;
                  this.db.database.ref('users/' + user.uid + '/Stock/' + item)
                    .set({
                      Available: CurrentStock,
                      Sold: CurrentSold,
                      Total: CurrentTotal
                    })
                    .then(() => {
                      this.snackbar.open('Stock Updated!', 'Ok', {
                        duration: 2000
                      });
                    });
                });
              });
          });
      }
    });
  }

  addentryexisting() {
    const name = this.addentryform.value.name;
    const amt = this.addentryform.value.amount;
    const date = this.addentryform.value.date;
    const item = this.addentryform.value.item.key;
    const quan = this.addentryform.value.quantity;
    let prev_amt = 0;
    let prev_date = '';
    let PrevAvailStock = 0;
    let PrevSoldStock = 0;
    let PrevTotal = 0;
    this.auth.authState.subscribe((user) => {
      if (user) {
        const userid = user.uid;
        this.db.database
          .ref('users/' + userid + '/History/' + name.CName)
          .once('value', (snapshot) => {
            let data = snapshot.val();
            if (data) {
              prev_amt = data.Amount;
              prev_date = data.Date;
            }
          })
          .then((a) => {
            this.db.database.ref('users/' + user.uid + '/Stock/' + item)
              .once('value', (snapshot) => {
                let val = snapshot.val();
                PrevAvailStock = Number(val.Available);
                PrevSoldStock = Number(val.Sold);
                PrevTotal = Number(val.Total);
              })
              .then(() => {
                let CurrentStock = PrevAvailStock - quan;
                let CurrentTotal = PrevTotal - quan;
                let CurrentSold = CurrentStock + CurrentTotal;
                this.db.database.ref('users/' + user.uid + '/Stock/' + item)
                  .set({
                    Available: CurrentStock,
                    Sold: CurrentSold,
                    Total: CurrentTotal
                  })
                  .then(() => {
                    this.snackbar.open('Stock Updated!', 'Ok', {
                      duration: 2000
                    });
                  });
              });
          });
      }
    });
  }

  logout() {
    this.authservice.SignOut().then((a) => {
      this.router.navigate(['/login']);
    });
  }
}
