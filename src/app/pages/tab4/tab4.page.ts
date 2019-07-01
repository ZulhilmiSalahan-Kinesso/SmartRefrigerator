import { Component, OnInit } from '@angular/core';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public barcodeScannerService: BarcodeScannerService) { }

  ngOnInit() {
  }

}
