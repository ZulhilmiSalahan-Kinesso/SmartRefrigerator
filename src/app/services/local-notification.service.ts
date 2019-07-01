import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  constructor(private localNotifications: LocalNotifications) {  }

  scheduleSingleNotification() {
    // Schedule a single notification
    console.log('schedule notification');
    this.localNotifications.schedule([{
      id: 1,
      title: 'Rendang',
      text: 'This item will expired in 3 days'
    },
    {
      id: 2,
      title: 'Ketupat',
      text: 'This item will expired in 2 days'
    }]
    );
  }
}
