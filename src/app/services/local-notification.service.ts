import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { MyNotification } from '../models/mynotification';
import { FirebaseService } from './firebase.service'
import { Item } from '../models/item';
@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  items: any;

  constructor(
    private localNotifications: LocalNotifications,
    private firebaseService: FirebaseService) {  }

  scheduleSingleNotification() {
    // Schedule a single notification
    console.log('schedule notification');
    this.localNotifications.schedule([{
      id: 1,
      title: 'Rendang',
      text: 'This item will expired in 3 days',
      sound: 'resources/sound.mp3',
      // tslint:disable-next-line: max-line-length
      attachments: ['file://resources/icon.png']
    },
    {
      id: 2,
      title: 'Ketupat',
      text: 'This item will expired in 2 days',
      attachments: ['https://cdn-images-1.medium.com/max/1600/0*xMaFF2hSXpf_kIfG.jpg'],
      vibrate: true
    }]
    );
  }

  registerNotification(notification: MyNotification){
    this.localNotifications.schedule({
      id: notification.id,
      title: notification.title,
      text: notification.text
      //trigger: {at: notification.trigger}
    });
  }

  getRegisteredNotification(){
    return this.localNotifications.getScheduledIds();
  }

  registerItemNotification(){
    console.log('Register Item Notification');

    this.firebaseService.getItems().subscribe(res => {
      this.items = res;
    });

    this.items.forEach(element => {
      console.log(element.Name);
    });
  }
}
