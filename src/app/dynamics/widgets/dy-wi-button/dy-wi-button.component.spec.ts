import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiButtonComponent } from './dy-wi-button.component';

describe('DyWiButtonComponent', () => {
  let component: DyWiButtonComponent;
  let fixture: ComponentFixture<DyWiButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
