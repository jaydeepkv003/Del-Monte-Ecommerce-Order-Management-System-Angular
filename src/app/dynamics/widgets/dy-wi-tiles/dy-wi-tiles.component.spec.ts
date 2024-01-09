import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiTilesComponent } from './dy-wi-tiles.component';

describe('DyWiTilesComponent', () => {
  let component: DyWiTilesComponent;
  let fixture: ComponentFixture<DyWiTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiTilesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
