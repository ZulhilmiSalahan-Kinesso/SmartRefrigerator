import { FirebaseService } from '../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Item } from 'src/app/models/item';
import { PhotoService } from 'src/app/services/photo.service';
import { Photo } from 'src/app/models/photo';
import { ToastService } from 'src/app/services/toast.service';
import { LocalNotificationService } from 'src/app/services/local-notification.service';
import { MyNotification } from 'src/app/models/mynotification';
import { BarcodeScannerService } from 'src/app/services/barcode-scanner.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ImagePickerService } from '../../services/image-picker.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  public photos: Photo[] = [];
  itemId = null;

  public photo: Photo;

  constructor(private route: ActivatedRoute,
    private nav: NavController,
    private itemService: FirebaseService,
    private loadingController: LoadingController,
    private photoService: PhotoService,
    private toastService: ToastService,
    private localNotificationService: LocalNotificationService,
    private barcodeScanner: BarcodeScanner) { }

    today: any;
    expiredDate: any;

    item: Item = {
      name: '',
      // tslint:disable-next-line: max-line-length
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAKBueIx4ZKCMgoy0qqC+8P//8Nzc8P//////////////////////////////////////////////////////////2wBDAaq0tPDS8P//////////////////////////////////////////////////////////////////////////////wAARCAeoD8ADASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECA//EABUQAQEAAAAAAAAAAAAAAAAAAAAR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACoAoUAAAAAAAAAAABAAAAAAAAAAAFQBRAFEUAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQQVAAAAAAAAAAAAAAABQEUAQUAAAABAAAAAAAAFQAAAABRAFEUAEBUAAAAAAAAAAABUUBFQAAAAAABUAAAAAAAAAAAAAVAAABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFARQAAAQAAAAAAAAAAAAAAAAAAUEAAAAAAAAAAAAAAAAAAAAUQBQAQUEFAEAAAAAAAAAAAAVAURQAAAAAAAAQVAAAAAAAAABQAAAAAAAAAAAABFQAAAAAUARUBQAAAAAAAAAAAAAAQAABUAUEAUAAAAAAAAAAAAAAAEVAFRQAARQAAAAAAAAABQQAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAUEAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAABUAUABFQAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVAFEAUQBRAFEAVWQGhkoNIgCiAKIAogCoAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==',
      barcode: '',
      expiredDate: new Date(),
      createdAt: new Date().getTime()
    };

    myNotification: MyNotification = {
      id: 1,
      text: '',
      title: '',
      trigger: new Date(),
      attachments: []
    };

  ngOnInit() {
    this.itemId = this.route.snapshot.params['id'];
    if (this.itemId)  {
      this.loadItem();
    }
  }

  async loadItem() {
    const loading = await this.loadingController.create({
      message: 'Loading Item..'
    });
    await loading.present();

    this.itemService.getItem(this.itemId).subscribe(res => {
      this.item = res;
      loading.dismiss();
    });
  }

  async saveItem() {
    const loading = await this.loadingController.create({
      message: 'Saving Item..'
    });

    if (this.photoService.photos.length > 0) {
      this.item.image = this.photoService.photos[0].data;
      this.photoService.photos = [];
    }

    await loading.present();

    if (this.itemId) {
      this.itemService.updateItem(this.item, this.itemId).then(() => {
        this.toastService.presentToast('Your item is saved');
        loading.dismiss();
        this.nav.goBack();
      });
    } else {
      this.itemService.addItem(this.item).then(() => {
        this.toastService.presentToast('Your item is added');
        loading.dismiss();
        this.nav.goBack();
      });
    }
  }

  takePicture(item: Item) {
    this.photoService.takePicture();
  }

  scanBarcode() {
    this.barcodeScanner.scan().then( res => {
      this.item.barcode = res.text;
    }).catch( err => {
      this.toastService.presentToast(err);
    });
  }

  triggerNotification() {
    this.myNotification.id = this.item.createdAt;
    this.myNotification.title = this.item.name;
    this.today = new Date();
    this.expiredDate = new Date(this.item.expiredDate);
    let numberOfDays = Math.round((this.expiredDate - this.today) / (1000 * 60 * 60 * 24));
    console.log(numberOfDays);
    this.myNotification.text = 'This item will expired in ' + numberOfDays + ' days at ' + this.item.expiredDate;
    this.localNotificationService.registerNotification(this.myNotification);
  }
}
