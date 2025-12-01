import { TestBed } from '@angular/core/testing';

import { OdrzavanjeService } from './services/odrzavanje.service';

describe('OdrzavanjeService', () => {
  let service: OdrzavanjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdrzavanjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
