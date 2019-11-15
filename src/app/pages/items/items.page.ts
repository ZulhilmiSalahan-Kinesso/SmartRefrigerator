import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Platform, AlertController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { BarcodeScannerService } from 'src/app/services/barcode-scanner.service';
import { ToastService } from 'src/app/services/toast.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items: Item[];
  barcodeItems: Item[];
  isFilterHidden: boolean = false;

  constructor(
    private platform: Platform,
    private fcmService: FcmService,
    private itemService: FirebaseService,
    private barcodeService: BarcodeScannerService,
    public alertController: AlertController,
    private toastService: ToastService) { }

  ngOnInit() {
    this.hideFilter();

    // Get item list
    this.itemService.getItems().subscribe( res => {
      this.items = res;
      this.fcmService.getToken();
    });
  }

  ionViewDidEnter() {
    // Register token
    //console.log('Register Token');
    //this.fcmService.getToken();
  }

  async remove( item ) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'This item still in fridge?',
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.toastService.presentToast('Not able to delete');
          }
        }, {
          text: 'No',
          handler: () => {
            this.itemService.removeItem( item.id );
            this.toastService.presentToast('Item is deleted');
          }
        }
      ]
    });

    await alert.present();
  }

  findItemByBarcode() {
    this.barcodeService.openBarcodeScanner().then( res => {
      this.toastService.presentToast(res.text);
      this.barcodeItems = this.items.filter( (element, index, array) => {
        return (element.barcode == res.text);
      });
      this.isFilterHidden = false;
    }).catch( err => {
      this.toastService.presentToast(err);
    });
  }

  hideFilter() {
    this.isFilterHidden = true;
  }
}
