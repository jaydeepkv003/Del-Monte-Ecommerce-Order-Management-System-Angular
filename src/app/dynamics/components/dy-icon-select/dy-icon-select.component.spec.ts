import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyIconSelectComponent } from './dy-icon-select.component';

describe('DyIconSelectComponent', () => {
  let component: DyIconSelectComponent;
  let fixture: ComponentFixture<DyIconSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyIconSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyIconSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
