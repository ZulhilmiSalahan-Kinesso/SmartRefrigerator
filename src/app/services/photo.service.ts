import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { Photo } from '../models/photo';
import { Item } from '../models/item';
import { ItemDetailsPage } from '../pages/item-details/item-details.page';
import { ToastService } from './toast.service';
import { FirebaseStorageService } from './firebase-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { resolve, reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  public cameraInfo: any;

  constructor(
    private camera: Camera,
    private webView: WebView,
    private toastService: ToastService,
    private sanitizer: DomSanitizer,
    private storageService: FirebaseStorageService,
    private storage: Storage) { }
/*
  async takePicture() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
        this.cameraInfo = await this.camera.getPicture(options).then(async (imageData) => {
        imageData = this.sanitizer.bypassSecurityTrustUrl(this.webView.convertFileSrc(imageData));
      // Add new photo to gallery
      this.photos.unshift({
        data: imageData
      });
      this.storage.set('photos', this.photos);
      resolve(imageData);
    }, (err) => {
      this.toastService.presentToast('Camera issue: ' + err);
      reject(err);
    });
  }
*/
  async takePicture() {
    const options: CameraOptions = {
      quality: 5,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // Add new photo to gallery
      this.photos.unshift({
        data: 'data:image/jpeg;base64,' + imageData
      });

      // Save all photos for later viewing
      this.storage.set('photos', this.photos);
    }, (err) => {
     // Handle error
     this.toastService.presentToast('Camera issue: ' + err);
    });
  }

  /*
  async uploadToStorage() {
    await this.storageService.uploadBlobToStorage(this.cameraInfo);
  }
  */

  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }
}
