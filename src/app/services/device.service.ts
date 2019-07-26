import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    public firebaseService: FirebaseService
  ) { }

  registerDeviceToken() {
    let userDocument = this.firebaseService.usersDocument;
    const device = {
      token: 'device token here'
    }
    userDocument.collection('device').add(device);
  }
}
