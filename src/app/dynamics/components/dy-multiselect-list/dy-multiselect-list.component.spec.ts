import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyMultiselectListComponent } from './dy-multiselect-list.component';

describe('DyMultiselectListComponent', () => {
  let component: DyMultiselectListComponent;
  let fixture: ComponentFixture<DyMultiselectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyMultiselectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyMultiselectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
