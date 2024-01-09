import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyMultiselectComponent } from './dy-multiselect.component';

describe('DyMultiselectComponent', () => {
  let component: DyMultiselectComponent;
  let fixture: ComponentFixture<DyMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyMultiselectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
