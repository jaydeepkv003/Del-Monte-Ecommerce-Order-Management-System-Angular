import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyTextareaComponent } from './dy-textarea.component';

describe('DyTextareaComponent', () => {
  let component: DyTextareaComponent;
  let fixture: ComponentFixture<DyTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyTextareaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
