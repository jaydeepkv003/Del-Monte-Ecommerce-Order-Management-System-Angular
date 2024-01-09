import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiLineComponent } from './dy-wi-line.component';

describe('DyWiLineComponent', () => {
  let component: DyWiLineComponent;
  let fixture: ComponentFixture<DyWiLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
