import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiPosComponent } from './dy-wi-pos.component';

describe('DyWiPosComponent', () => {
  let component: DyWiPosComponent;
  let fixture: ComponentFixture<DyWiPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiPosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
