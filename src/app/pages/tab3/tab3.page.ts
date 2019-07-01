import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Todo } from 'src/app/entities/todo';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  todos: Todo[];
  constructor(private todoService: FirebaseService) { }
  ngOnInit() {
    this.todoService.getTodos().subscribe(res => {
      this.todos = res;
    });
  }
  remove(item) {
    this.todoService.removeTodo(item.id);
  }
}
