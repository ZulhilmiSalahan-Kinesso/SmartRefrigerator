import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items: Item[];

  constructor(
    private itemService: FirebaseService,
    private auth: AuthService) { }

  ngOnInit() {
    this.itemService.getItems().subscribe( res => {
      this.items = res;
    });

    this.itemService.listenItemCreated();
  }

  remove( item ) {
    this.itemService.removeItem( item.id );
  }

}
