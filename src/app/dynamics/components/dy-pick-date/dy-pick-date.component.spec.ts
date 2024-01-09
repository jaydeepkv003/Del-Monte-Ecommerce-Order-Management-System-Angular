import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyPickDateComponent } from './dy-pick-date.component';

describe('DyPickDateComponent', () => {
  let component: DyPickDateComponent;
  let fixture: ComponentFixture<DyPickDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyPickDateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyPickDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
