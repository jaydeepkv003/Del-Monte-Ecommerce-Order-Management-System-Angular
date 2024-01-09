import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyDataTableComponent } from './dy-data-table.component';

describe('DyDataTableComponent', () => {
  let component: DyDataTableComponent;
  let fixture: ComponentFixture<DyDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyDataTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
