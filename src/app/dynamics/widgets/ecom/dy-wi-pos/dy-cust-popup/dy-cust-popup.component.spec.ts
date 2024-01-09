import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyCustPopupComponent } from './dy-cust-popup.component';

describe('DyCustPopupComponent', () => {
  let component: DyCustPopupComponent;
  let fixture: ComponentFixture<DyCustPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyCustPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyCustPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
