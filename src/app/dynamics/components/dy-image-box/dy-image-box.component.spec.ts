import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyImageBoxComponent } from './dy-image-box.component';

describe('DyImageBoxComponent', () => {
  let component: DyImageBoxComponent;
  let fixture: ComponentFixture<DyImageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyImageBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyImageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
