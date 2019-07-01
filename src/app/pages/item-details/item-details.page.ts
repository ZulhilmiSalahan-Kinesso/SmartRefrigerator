import { FirebaseService } from '../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Item } from 'src/app/entities/item';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  itemId = null;

  constructor(private route: ActivatedRoute,
    private nav: NavController,
    private itemService: FirebaseService,
    private loadingController: LoadingController,
    private photoService: PhotoService) { }

    item: Item = {
      name: 'test',
      image: '',
      expiredDate: new Date().getDate(),
      createdAt: new Date().getTime()
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
      loading.dismiss();
      this.item = res;
    });
  }

  async saveItem() {
    const loading = await this.loadingController.create({
      message: 'Saving Item..'
    });
    await loading.present();

    if (this.itemId) {
      this.itemService.updateItem(this.item, this.itemId).then(() => {
        loading.dismiss();
        this.nav.goBack();
      });
    } else {
      this.itemService.addItem(this.item).then(() => {
        loading.dismiss();
        this.nav.goBack();
      });
    }
  }
}
