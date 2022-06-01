import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySelectorComponent } from './survey-selector.component';

describe('SurveySelectorComponent', () => {
  let component: SurveySelectorComponent;
  let fixture: ComponentFixture<SurveySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveySelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
