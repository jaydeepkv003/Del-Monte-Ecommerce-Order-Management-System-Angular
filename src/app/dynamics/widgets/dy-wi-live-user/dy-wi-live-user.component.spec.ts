import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiLiveUserComponent } from './dy-wi-live-user.component';

describe('DyWiLiveUserComponent', () => {
  let component: DyWiLiveUserComponent;
  let fixture: ComponentFixture<DyWiLiveUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiLiveUserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiLiveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
