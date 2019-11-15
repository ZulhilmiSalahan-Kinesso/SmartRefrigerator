import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { FcmService } from './../../services/fcm.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  item: Observable<Item[]>;
  token: Observable<String>;
  cameraInfo: any;

  constructor(
    private auth: AuthService,
    private toastService: ToastService,
    private firebaseStorage: FirebaseStorageService,
    public fcm: FcmService,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  getDeviceToken() {
    this.fcm.getToken();
  }

  uploadToStorage() {
    this.firebaseStorage.uploadBlobToStorage(this.cameraInfo);
  }

  takePicture() {
    this.cameraInfo = this.firebaseStorage.pickImage();
  }

  getDownloadUrl() {
    this.firebaseStorage.getDownloadUrl();
  }

  sendNotification(){
    const notification = {
      title: 'Item Expired',
      body: 'Your item is going to expired in 2 days',
      image: 'https://www.maggi.com.my/sites/default/files/ketupat-a.jpg'
    };

    this.fcm.sendNotification(notification);
  }

  logout() {
    this.auth.logoutUser().then(res => {
      this.navCtrl.navigateBack('');
    }, err => {
      this.toastService.presentToast(err);
    });
  }
}
