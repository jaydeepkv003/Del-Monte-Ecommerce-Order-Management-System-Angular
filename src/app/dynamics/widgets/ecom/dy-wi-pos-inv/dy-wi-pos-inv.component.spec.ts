import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiPosInvComponent } from './dy-wi-pos-inv.component';

describe('DyWiPosInvComponent', () => {
  let component: DyWiPosInvComponent;
  let fixture: ComponentFixture<DyWiPosInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiPosInvComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiPosInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
