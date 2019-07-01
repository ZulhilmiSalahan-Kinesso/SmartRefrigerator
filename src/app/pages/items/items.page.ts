import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/entities/item';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items: Item[];

  constructor(private itemService: FirebaseService) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(res => {
      this.items = res;
    });
  }

  remove(item) {
    this.itemService.removeItem(item.id);
  }

}
