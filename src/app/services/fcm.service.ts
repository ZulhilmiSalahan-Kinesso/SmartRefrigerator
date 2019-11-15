import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


import { MyUser } from '../models/myuser';
import { AuthService } from './auth.service';
import { MyDevice } from '../models/mydevice';
import { ToastService } from './toast.service';
import { FirebaseService } from './firebase.service';
import { MyNotification } from '../models/mynotification';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  public devicesCollection: AngularFirestoreCollection<MyDevice>;
  public usersDocument: AngularFirestoreDocument<MyUser>;
  public devices: Observable<MyDevice[]>;
  public device: MyDevice[];

  constructor(
    public firebaseNative: Firebase,
    public afMessaging: AngularFireMessaging,
    public firebaseService: FirebaseService,
    public afs: AngularFirestore,
    public platform: Platform,
    public toastService: ToastService,
    private auth: AuthService,
    private http: Http
  ) {
    this.getTokenList();
  }

  async getTokenList() {
    this.usersDocument = this.firebaseService.usersDocument;
    this.devices = this.usersDocument.collection<MyDevice>('devices').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.devices.subscribe(res => {
      this.device = res;
    });
  }

  async getToken() {
    this.firebaseNative.getToken()
      .then(token => {
        var res = this.device.filter((element, index, array) => {
          return (element.token === token);
        });

        if (res.length === 0){
          this.saveTokenToFirestore(token);
          this.toastService.presentToast('Successfully save token');
        } else {
          this.toastService.presentToast('Token already save');
        }
      })
      .catch(err => {
        this.toastService.presentToast(err);
      });
  }

  private saveTokenToFirestore( deviceToken ) {
    if ( !deviceToken ) { return; }
    this.usersDocument = this.firebaseService.usersDocument;

    this.devicesCollection = this.usersDocument.collection<MyDevice>( 'devices', ref => ref.where('tokens', '==', deviceToken));

    const myDevice: MyDevice = {
      token: deviceToken,
      createdAt: new Date()
    };

    this.devicesCollection.add(myDevice);
  }

  listenToNotifications() {
    this.afMessaging.messages.subscribe( message => {
      this.toastService.presentToast(message);
    });
  }

  sendNotification(notification: MyNotification) {
    // tslint:disable-next-line: max-line-length
    const title = notification.title;
    const body = notification.body;
    const image = notification.image;

    const payload = '?userId=' + this.auth.userDetails().uid + '&title=' + title + '&body=' + body + '&image=' + image;

    this.http.get(environment.firebase.functionUrl + '/sendNotification' + payload).subscribe(res => {
      this.toastService.presentToast('Successfully send notification');
    },
    err => {
      this.toastService.presentToast(err);
    });
  }
}
