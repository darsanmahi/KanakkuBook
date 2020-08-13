import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-displaystore',
  templateUrl: './displaystore.component.html',
  styleUrls: ['./displaystore.component.scss'],
})
export class DisplaystoreComponent implements OnInit {

  itemsRef: AngularFireList<any>;
  data1 : Observable<any> = null;
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      if(user) {
        const uid = user.uid;
        this.itemsRef = this.db.list('users/'+uid);
        this.data1 = this.itemsRef.valueChanges();
      }
    });
  }

  ngOnInit(): void {}
}
