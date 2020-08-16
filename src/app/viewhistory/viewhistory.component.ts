import { Observable, from } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-viewhistory',
  templateUrl: './viewhistory.component.html',
  styleUrls: ['./viewhistory.component.scss']
})
export class ViewhistoryComponent implements OnInit {

  itemsRef: AngularFireList<any>;
  data1: Observable<any>;
  data: string = '';

  constructor( private auth: AngularFireAuth, private db: AngularFireDatabase) {
    this.auth.authState.subscribe((user) => {
      if (user){
        this.db.database.ref('users/' + user.uid + '/Store/Storename').once("value", (snapshot) => {
          let d = snapshot.val();
          this.data = d;
        });

        this.itemsRef = this.db.list('users/' + user.uid + '/History');
        this.data1 = this.itemsRef
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
      }
    })
  }

  ngOnInit(): void {
  }

}
