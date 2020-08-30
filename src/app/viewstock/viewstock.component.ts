import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authservice.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-viewstock',
  templateUrl: './viewstock.component.html',
  styleUrls: ['./viewstock.component.scss']
})
export class ViewstockComponent implements OnInit {
  data: string;
  itemsRef: AngularFireList<any>;
  data1: Observable<any>;
  constructor(private authservice: AuthenticationService,
              private router: Router,
              private db: AngularFireDatabase,
              private auth: AngularFireAuth
            ) {
        this.auth.authState.subscribe((user) => {
            if (user){
              const uid = user.uid;
              this.db.database.ref('users/' + uid + '/Store/Storename').once('value', (snapshot) => {
                  this.data = snapshot.val();
              });
              this.itemsRef = this.db.list('users/' + uid + '/Stock');
              this.data1 = this.itemsRef.snapshotChanges()
                .pipe(
                map((changes) =>
                  changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
                )
              );
              this.data1.forEach(element => {
                  console.log(element);
              });
            }
        });
  }

  ngOnInit(): void {
  }

  logout() {
    this.authservice.SignOut().then((a) => {
      this.router.navigate(['/login']);
    });
  }
}
