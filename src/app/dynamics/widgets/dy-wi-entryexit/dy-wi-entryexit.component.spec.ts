import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyWiEntryexitComponent } from './dy-wi-entryexit.component';

describe('DyWiEntryexitComponent', () => {
  let component: DyWiEntryexitComponent;
  let fixture: ComponentFixture<DyWiEntryexitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyWiEntryexitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyWiEntryexitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
