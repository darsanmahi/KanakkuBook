import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-storename',
  templateUrl: './storename.component.html',
  styleUrls: ['./storename.component.scss'],
})
export class StorenameComponent implements OnInit {
  storenameform: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.storenameform = this.formbuilder.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  addStore() {
    const sname = this.storenameform.value.name;
    this.storenameform.reset();
    this.auth.authState.subscribe((user) => {
      if (user) {
        const uid = user.uid;
        this.db.database
          .ref('users/' + uid +'/Store')
          .set({
            StoreName: sname,
          })
          .then((a) => {
            this.router.navigate(['/displaystore']);
          });
      }
    });
  }
}
