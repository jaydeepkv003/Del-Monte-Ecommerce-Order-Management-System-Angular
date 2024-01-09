import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiListComponent } from './dy-wi-list.component';

describe('DyWiListComponent', () => {
  let component: DyWiListComponent;
  let fixture: ComponentFixture<DyWiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
