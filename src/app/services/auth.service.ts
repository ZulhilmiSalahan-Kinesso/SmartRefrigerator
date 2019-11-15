import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastService: ToastService
    ) { }

  registerUser(value) {
    return new Promise<any>( (resolve, reject) => {
      this.afAuth
      .auth
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => {
          this.toastService.presentToast('Successfully register user');
          resolve(res);
        },
        err => {
          this.toastService.presentToast(err);
          reject(err);
      });
    });
   }

   loginUser(value) {
    return new Promise<any>( (resolve, reject) => {
      this.afAuth.auth
      .signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => {
          this.toastService.presentToast('User logged in');
          resolve(res);
        },
        err => {
          this.toastService.presentToast(err);
          reject(err);
        });
    });
   }

   logoutUser() {
     return new Promise((resolve, reject) => {
         this.afAuth
         .auth
         .signOut()
         .then(() => {
           this.toastService.presentToast('User logged out');
           resolve();
         }).catch((err) => {
           this.toastService.presentToast(err);
           reject();
         });
     });
   }

   userDetails() {
     return this.afAuth
     .auth
     .currentUser;
   }
}