import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiBarComponent } from './dy-wi-bar.component';

describe('DyWiBarComponent', () => {
  let component: DyWiBarComponent;
  let fixture: ComponentFixture<DyWiBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyWiBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
