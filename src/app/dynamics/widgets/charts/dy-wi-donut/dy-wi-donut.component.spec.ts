import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiDonutComponent } from './dy-wi-donut.component';

describe('DyWiDonutComponent', () => {
  let component: DyWiDonutComponent;
  let fixture: ComponentFixture<DyWiDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiDonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
