import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyPickFileComponent } from './dy-pick-file.component';

describe('DyPickFileComponent', () => {
  let component: DyPickFileComponent;
  let fixture: ComponentFixture<DyPickFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyPickFileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyPickFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
