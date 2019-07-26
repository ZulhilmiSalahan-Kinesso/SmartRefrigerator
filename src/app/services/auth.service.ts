import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth
    ) { }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err));
    });
   }

   loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err));
    });
   }

   logoutUser() {
     return new Promise((resolve, reject) => {
         this.afAuth.auth.signOut()
         .then(() => {
           console.log('Log Out');
           resolve();
         }).catch((error) => {
           reject();
         });
     });
   }

   userDetails() {
     return this.afAuth.auth.currentUser;
   }
}