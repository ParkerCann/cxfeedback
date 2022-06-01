import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyMonkeyCallsComponent } from './survey-monkey-calls.component';

describe('SurveyMonkeyCallsComponent', () => {
  let component: SurveyMonkeyCallsComponent;
  let fixture: ComponentFixture<SurveyMonkeyCallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyMonkeyCallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyMonkeyCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
