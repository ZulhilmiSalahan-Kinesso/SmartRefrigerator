import { Component } from '@angular/core';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  currentImage: any;

  constructor(public photoService: PhotoService) {  }

  // tslint:disable:use-life-cycle-interface
  ngOnInit() {
    this.photoService.loadSaved();
  }

// tslint:disable:eofline
}