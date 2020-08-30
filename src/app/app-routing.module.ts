import { UpdatestockComponent } from './updatestock/updatestock.component';
import { AddstockComponent } from './addstock/addstock.component';
import { ViewstockComponent } from './viewstock/viewstock.component';
import { ClearhistoryComponent } from './clearhistory/clearhistory.component';
import { ViewhistoryComponent } from './viewhistory/viewhistory.component';
import { StorenameComponent } from './storename/storename.component';
import { DisplaystoreComponent } from './displaystore/displaystore.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'displaystore', component: DisplaystoreComponent},
  { path: 'storename', component: StorenameComponent },
  { path: 'viewhistory', component: ViewhistoryComponent },
  { path: 'clearhistory', component: ClearhistoryComponent},
  { path: 'viewstock', component: ViewstockComponent},
  { path: 'addstock', component: AddstockComponent },
  { path: 'updatestock', component: UpdatestockComponent},
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
