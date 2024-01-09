import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DySwitchComponent } from './dy-switch.component';

describe('DySwitchComponent', () => {
  let component: DySwitchComponent;
  let fixture: ComponentFixture<DySwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DySwitchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DySwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
