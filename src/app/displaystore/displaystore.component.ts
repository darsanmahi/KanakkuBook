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
  data1 : Observable<any> = null;
  data2 : Array<string> = [];
  ischecked: boolean = false;
  data: string = '';

  addentryform: FormGroup;
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private formbuilder: FormBuilder, private snackbar: MatSnackBar) {
    this.auth.authState.subscribe((user) => {
      if(user) {
        const uid = user.uid;
        this.db.database.ref('users/' + uid + '/Store/Storename').once("value", (snapshot) => {
          let d = snapshot.val();
          this.data = d;
        });
        this.itemsRef = this.db.list('users/' + uid + '/Customers');
        this.data1 = this.itemsRef.snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
          )
        );
        this.data1.forEach(element => {
          console.log(element);
        });
      }
    });

    this.addentryform = this.formbuilder.group({
      name: ['',Validators.required],
      amount: ['',Validators.required],
      date: ['',Validators.required]
    })
  }

  ngOnInit(): void {}

  toggle() {
    if(this.ischecked){
      this.ischecked = false;
    }
    else{
      this.ischecked = true;
    }
  }
  addentry(){
    const name = this.addentryform.value.name;
    const amt = this.addentryform.value.amount;
    const date = this.addentryform.value.date;
    let prev_amt = 0;
    let prev_date = '';
    console.log(amt);
    this.auth.authState.subscribe((user) => {
      if (user) {
        const userid = user.uid;
        this.db.database.ref('users/'+ userid + '/Customers').push({
          CName : name
        });
        this.db.database.ref("users/" + userid + '/History/' + name).once("value",(snapshot) => {
          let data = snapshot.val();
          if(data){
            prev_amt = data.Amount;
            prev_date = data.Date;
          }
        })
        .then((a) => {
          this.db.database.ref("users/" + userid + "/History/" +name ).set({
            Amount: prev_amt+amt,
            Date: prev_date+','+date
          })
          .then((a) => {
            alert("Entry Added Successfully");
            this.addentryform.reset();
          })
        })
      }
    });
  }

  addentryexisting(){
    const name = this.addentryform.value.name;
    const amt = this.addentryform.value.amount;
    const date = this.addentryform.value.date;
    console.log(name.CName);
    let prev_amt = 0;
    let prev_date = '';
    console.log(amt);
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
            let new_date = '';
            if(prev_date){
              new_date = prev_date + ',' + date;
            }
            else {
              new_date = date;
            }
            this.db.database
              .ref('users/' + userid + '/History/' + name.CName)
              .set({
                Amount: prev_amt + amt,
                Date: new_date,
              })
              .then((a) => {
                alert('Entry Added Successfully');
                this.addentryform.reset();
              });
          });
      }
    });
  }
}
