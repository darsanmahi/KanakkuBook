import { RouterModule } from '@angular/router';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplaystoreComponent } from './displaystore/displaystore.component';
import { StorenameComponent } from './storename/storename.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DisplaystoreComponent,
    StorenameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  entryComponents: [LoginComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
