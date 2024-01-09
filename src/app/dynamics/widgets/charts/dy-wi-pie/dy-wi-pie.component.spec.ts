import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiPieComponent } from './dy-wi-pie.component';

describe('DyWiPieComponent', () => {
  let component: DyWiPieComponent;
  let fixture: ComponentFixture<DyWiPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
