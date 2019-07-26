import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { FcmService } from './../../services/fcm.service';
import { ToastService } from './../../services/toast.service';
import { DeviceService } from './../../services/device.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  item: Observable<Item[]>;
  token: Observable<String>;
  constructor(
    private auth: AuthService,
    private toastService: ToastService,
    public fcm: FcmService,
    private afMessaging: AngularFireMessaging,
    private deviceService: DeviceService,
    private itemService: FirebaseService,
    private loadingController: LoadingController,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.token = this.afMessaging.getToken;
    this.token = this.afMessaging.tokenChanges;
  }

  registerDeviceToken() {
    this.deviceService.registerDeviceToken();
  }

  getDeviceToken() {
    this.fcm.getToken();
  }

  getDeviceTokenDirect() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          this.toastService.presentToast(token);
      },
        (error) => { console.error(error); },
      );
  }

  async triggerAllNotification() {
    const loading = await this.loadingController.create({
      message: 'Get Item..'
    });
    loading.present();
    console.log('trigger all notification');
    loading.dismiss();
  }

  logout() {
    this.auth.logoutUser().then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    }, err => {
      console.log(err);
    });
  }
}