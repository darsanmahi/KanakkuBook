import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clearhistory',
  templateUrl: './clearhistory.component.html',
  styleUrls: ['./clearhistory.component.scss'],
})
export class ClearhistoryComponent implements OnInit {
  clearform: FormGroup;
  data: Observable<any> = null;
  data1: Observable<any> = null;
  itemsRef: AngularFireList<any>;
  constructor(
    private formbuilder: FormBuilder,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private snackbar: MatSnackBar,
    private authservice: AuthenticationService,
    private router: Router
  ) {
    this.clearform = this.formbuilder.group({
      name: ['', Validators.required],
    });

    this.auth.authState.subscribe((user) => {
      if (user) {
        this.itemsRef = this.db.list('users/' + user.uid + '/Customers');
        this.data1 = this.itemsRef
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
        this.db.database
          .ref('users/' + user.uid + '/Store/Storename')
          .once('value', (snapshot) => {
            let d = snapshot.val();
            this.data = d;
          });
      }
    });
  }

  ngOnInit(): void {}

  clearentry() {
    const name = this.clearform.value.name;
    this.clearform.reset();
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.db.database
          .ref('users/' + user.uid + '/History' + '/' + name.CName)
          .remove()
          .then((a) => {
            this.snackbar.open('Entries of' + name.CName + ' deleted', 'Ok', {
              duration: 2000,
            });
          });
      }
    });
  }

  clearallentries() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.db.database
          .ref('users/' + user.uid + '/History')
          .remove()
          .then((a) => {
            this.snackbar.open('All Entries deleted', 'Ok', {
              duration: 2000,
            });
          });
      }
    });
  }

  logout() {
    this.authservice.SignOut()
    .then((a)=>{
      this.router.navigate(['/login']);
    });
  }
}
