import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, LoadingController } from '@ionic/angular';
import { UserSettingsService } from 'src/app/services/user-settings.service';
import { MyUser } from 'src/app/models/myuser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  setting: MyUser = {
    NotifyBefore: 0,
    NotifyTime: new Date()
  };

  constructor(
    private settingService: UserSettingsService,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.getSetting();
  }

  async getSetting(){
    const loading = await this.loadingController.create({
      message: 'Loading Item..'
    });
    await loading.present();

    this.settingService.getSetting().subscribe(res => {
      this.setting = res;
      loading.dismiss();
    });
  }

  async saveSettings() {
    const loading = await this.loadingController.create({
      message: 'Saving Setting..'
    });
    await loading.present();

    this.settingService.saveSetting(this.setting).then(res => {
      loading.dismiss();
    });
  }
}
