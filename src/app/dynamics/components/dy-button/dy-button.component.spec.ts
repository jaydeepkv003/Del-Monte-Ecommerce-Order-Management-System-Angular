import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyButtonComponent } from './dy-button.component';

describe('DyButtonComponent', () => {
  let component: DyButtonComponent;
  let fixture: ComponentFixture<DyButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
