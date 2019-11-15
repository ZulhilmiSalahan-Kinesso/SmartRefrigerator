import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async presentToast(strMessage) {
    const toast = await this.toastController.create({
      message: strMessage,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
