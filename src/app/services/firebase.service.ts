import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from '../entities/todo';
import { Item } from '../entities/item';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private todosCollection: AngularFirestoreCollection<Todo>;
  private todos: Observable<Todo[]>;

  private itemsCollection: AngularFirestoreCollection<Item>;
  private items: Observable<Item[]>;

  constructor(db: AngularFirestore) {

    this.todosCollection = db.collection<Todo>('todos');
    this.todos = this.todosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.itemsCollection = db.collection<Item>('items');
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

  getTodos() {
    return this.todos;
  }

  getTodo(id) {
    return this.todosCollection.doc<Todo>(id).valueChanges();
  }

  updateTodo(todo: Todo, id: string) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Todo) {
    return this.todosCollection.add(todo);
  }

  removeTodo(id) {
    return this.todosCollection.doc(id).delete();
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
}
