import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DySelectComponent } from './dy-select.component';

describe('DySelectComponent', () => {
  let component: DySelectComponent;
  let fixture: ComponentFixture<DySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DySelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
