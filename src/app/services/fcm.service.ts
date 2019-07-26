import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirebaseService } from './firebase.service';
import { MyUser } from '../models/myuser';
import { ToastService } from './toast.service';
import { Platform } from '@ionic/angular';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Firebase } from '@ionic-native/firebase/ngx';


class MyDevice {
  id?: string;
  tokens: string;
}

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  public devicesCollection: AngularFirestoreCollection<MyDevice>;
  public usersDocument: AngularFirestoreDocument<MyUser>;

  constructor(
    public firebaseNative: Firebase,
    public afMessaging: AngularFireMessaging,
    public firebaseService: FirebaseService,
    public afs: AngularFirestore,
    public platform: Platform,
    public toastService: ToastService
  ) { }

  async getToken() {
    this.firebaseNative.getToken()
      .then(token => this.saveTokenToFirestore(token))
      .catch(err => this.toastService.presentToast(err));
    /*
    token = this.afMessaging.requestToken.subscribe(
      resToken => {
        this.saveTokenToFirestore(resToken);
        this.toastService.presentToast('Token : ' + resToken);
      },
      resErr => {
        this.toastService.presentToast(resErr);
      });

      this.toastService.presentToast('outside');
      */
  }

  private saveTokenToFirestore( token ) {
    if ( !token ) { return; }
    this.usersDocument = this.firebaseService.usersDocument;

    this.devicesCollection = this.usersDocument.collection<MyDevice>( 'devices' );

    const docData = {
      tokens: token
    };

    return this.devicesCollection.add(docData);
  }

  listenToNotifications() {
    this.afMessaging.messages.subscribe( message => {
      this.toastService.presentToast(message);
    });
  }
}
