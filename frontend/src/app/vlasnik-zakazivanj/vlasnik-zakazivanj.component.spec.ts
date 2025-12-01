import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikZakazivanjComponent } from './vlasnik-zakazivanj.component';

describe('VlasnikZakazivanjComponent', () => {
  let component: VlasnikZakazivanjComponent;
  let fixture: ComponentFixture<VlasnikZakazivanjComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikZakazivanjComponent]
    });
    fixture = TestBed.createComponent(VlasnikZakazivanjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
