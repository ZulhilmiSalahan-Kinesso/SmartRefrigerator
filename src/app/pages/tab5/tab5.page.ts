import { Component, OnInit } from '@angular/core';
import { LocalNotificationService } from '../../services/local-notification.service';
import { MyNotification } from 'src/app/models/mynotification';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  scheduleNotification: any;

  constructor(private localNotificationService: LocalNotificationService) { }

  myNotification: MyNotification = {
    id: 1,
    text: '',
    title: '',
    trigger: new Date(),
    attachments: []
  };

  ngOnInit() {
  }

  callSingleNotification() {
    this.localNotificationService.scheduleSingleNotification();
  }

  registerNotification() {
    this.localNotificationService.registerNotification(this.myNotification);
  }

  getScheduleNotofication(){
    this.localNotificationService.getRegisteredNotification().then( success => 
      {
        this.scheduleNotification = success.toString();
      }
    ).catch(
      failure => {
        this.scheduleNotification = failure.toString();
      }
    );
  }
}
