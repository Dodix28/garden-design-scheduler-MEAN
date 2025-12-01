import { TestBed } from '@angular/core/testing';

import { ZakazivanjeService } from './services/zakazivanje.service';

describe('ZakazivanjeService', () => {
  let service: ZakazivanjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZakazivanjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
