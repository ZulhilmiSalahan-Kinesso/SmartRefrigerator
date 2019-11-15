import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  private cameraInfo: any;
  public downloadUrl: any;

  constructor(
    private camera: Camera,
    private file: File,
    private toastService: ToastService
  ) { }

  async pickImage() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    try {
      this.cameraInfo = await this.camera.getPicture(options);
      this.uploadBlobToStorage(this.cameraInfo);
    } catch (e) {
      this.toastService.presentToast('File Upload Error ' + e.message);
    }

    return this.cameraInfo;
  }

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;

          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
          this.toastService.presentToast('path : ' + path + ' fileName : ' + name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob = new Blob([buffer], {
            type: 'image/jpeg'
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  /**
   *
   * @param _imageBlobInfo
   */
  uploadToFirebase(_imageBlobInfo) {
    return new Promise((resolve, reject) => {
      let fileRef = firebase.storage().ref('images/' + _imageBlobInfo.fileName);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.on(
        'state_changed',
        (_snapshot: any) => {
          console.log(
            'snapshot progess ' +
              (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
          );
        },
        _error => {
          console.log(_error);
          reject(_error);
        },
        () => {
          resolve(uploadTask.snapshot);
        }
      );
    });
  }

  getDownloadUrl() {
    this.toastService.presentToast(this.downloadUrl);
  }

  async uploadBlobToStorage(cameraInfo: any) {
    const blobInfo = await this.makeFileIntoBlob(cameraInfo);
    const uploadInfo: any = await this.uploadToFirebase(blobInfo);
    await uploadInfo.ref.getDownloadURL().then( downloadUrl => {
      this.downloadUrl = downloadUrl;
      this.toastService.presentToast(downloadUrl);
    }, err => {
      this.toastService.presentToast('Error upload image to Storage : ' + err);
    });
  }
}
