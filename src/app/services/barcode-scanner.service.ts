import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {

  constructor(private barcodeScanner: BarcodeScanner) { }

  async openBarcodeScanner() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      return barcodeData;
     }).catch(err => {
         console.log('Barcode Scanner Issue', err);
         return err;
     });
  }
}
