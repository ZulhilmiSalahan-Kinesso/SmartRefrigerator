import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastService } from './toast.service'

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastService: ToastService) { }

  async openBarcodeScanner() {
    /*
    this.barcodeScanner.scan().then( barcodeData => {
      this.toastService.presentToast('Barcode data ' + barcodeData.text);
      return barcodeData;
     }).catch(err => {
      this.toastService.presentToast('Barcode Scanner Issue : ' + err);
      return err;
     });
     */
    return this.barcodeScanner.scan();
  }
}
