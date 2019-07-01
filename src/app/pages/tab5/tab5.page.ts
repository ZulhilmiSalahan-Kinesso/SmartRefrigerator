import { Component, OnInit } from '@angular/core';
import { LocalNotificationService } from '../../services/local-notification.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(private localNotificationService: LocalNotificationService) { }

  ngOnInit() {
  }

}
