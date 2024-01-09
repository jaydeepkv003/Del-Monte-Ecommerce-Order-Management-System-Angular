import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiOrderComponent } from './dy-wi-order.component';

describe('DyWiOrderComponent', () => {
  let component: DyWiOrderComponent;
  let fixture: ComponentFixture<DyWiOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
