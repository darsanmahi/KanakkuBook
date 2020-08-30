import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authservice.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-updatestock',
  templateUrl: './updatestock.component.html',
  styleUrls: ['./updatestock.component.scss']
})
export class UpdatestockComponent implements OnInit {

  data: string;
  itemsRef: AngularFireList<any>;
  data1: Observable<any>;

  updatestockform = this.fb.group({
    name:['',Validators.required],
    quantity: [0, Validators.required]
  });

  constructor(private authservice: AuthenticationService, private router: Router, private auth: AngularFireAuth,
              private db: AngularFireDatabase, private fb: FormBuilder, private snackbar: MatSnackBar) {
      this.auth.authState.subscribe((user) => {
        if (user){
          this.db.database.ref('users/' + user.uid + '/Store/Storename').once('value', (snapshot) => {
            this.data = snapshot.val();
          });

          this.itemsRef = this.db.list('users/' + user.uid + '/Stock');
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

  updateStock(): void {
      let PrevAvailStock = 0;
      let PrevSoldStock = 0;
      let PrevTotal = 0;
      let ItemName = this.updatestockform.value.name.key;
      let ItemQuant = this.updatestockform.value.quantity;
      console.log(ItemName);
      this.auth.authState.subscribe((user) => {
        if (user) {
          this.db.database.ref('users/' + user.uid + '/Stock/' + ItemName)
          .once('value', (snapshot) => {
            let val = snapshot.val();
            PrevAvailStock = Number(val.Available);
            PrevSoldStock = Number(val.Sold);
            PrevTotal = Number(val.Total);
          })
          .then(() => {
            let CurrentStock = PrevAvailStock + ItemQuant;
            let CurrentTotal = PrevTotal + ItemQuant;
            this.db.database.ref('users/' + user.uid + '/Stock/' + ItemName)
            .set({
              Available: CurrentStock,
              Sold: PrevAvailStock,
              Total: CurrentTotal
            })
            .then(() => {
              this.snackbar.open('Stock Updated!','Ok',{
                duration: 2000
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
