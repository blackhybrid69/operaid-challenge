import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenVisualisierung } from './daten-visualisierung';

describe('DatenVisualisierung', () => {
  let component: DatenVisualisierung;
  let fixture: ComponentFixture<DatenVisualisierung>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatenVisualisierung]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatenVisualisierung);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
