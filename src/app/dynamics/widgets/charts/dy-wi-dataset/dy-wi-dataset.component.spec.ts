import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiDatasetComponent } from './dy-wi-dataset.component';

describe('DyWiDatasetComponent', () => {
  let component: DyWiDatasetComponent;
  let fixture: ComponentFixture<DyWiDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
