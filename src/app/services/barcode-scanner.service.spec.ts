import { TestBed } from '@angular/core/testing';

import { BarcodeScannerService } from './barcode-scanner.service';

describe('BarcodeScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarcodeScannerService = TestBed.get(BarcodeScannerService);
    expect(service).toBeTruthy();
  });
});
