import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiNavassignComponent } from './dy-wi-navassign.component';

describe('DyWiNavassignComponent', () => {
  let component: DyWiNavassignComponent;
  let fixture: ComponentFixture<DyWiNavassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiNavassignComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiNavassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
