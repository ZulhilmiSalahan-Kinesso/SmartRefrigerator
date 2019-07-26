import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../models/item';
import { AuthService } from './auth.service';
import { MyUser } from '../models/myuser';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public itemsCollection: AngularFirestoreCollection<Item>;
  public usersDocument: AngularFirestoreDocument<MyUser>;
  private items: Observable<Item[]>;
  private userId: string;

  constructor(
    private toastService: ToastService,
    private db: AngularFirestore,
    private auth: AuthService ) {

    this.userId = auth.userDetails().uid;

    this.usersDocument = db.collection( 'users' ).doc<MyUser>(this.userId);
    this.itemsCollection = this.usersDocument.collection<Item>( 'items' );

    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getItems() {
    return this.items;
  }

  getItem(id) {
    return this.itemsCollection.doc<Item>(id).valueChanges();
  }

  updateItem(item: Item, id: string) {
    return this.itemsCollection.doc(id).update(item);
  }

  addItem(item: Item) {
    return this.itemsCollection.add(item);
  }

  removeItem(id) {
    return this.itemsCollection.doc(id).delete();
  }

  listenItemCreated() {
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.toastService.presentToast(data);
          return { id, ...data };
        });
      })
    );
  }
}
