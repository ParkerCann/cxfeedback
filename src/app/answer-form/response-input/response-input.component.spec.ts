import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseInputComponent } from './response-input.component';

describe('ResponseInputComponent', () => {
  let component: ResponseInputComponent;
  let fixture: ComponentFixture<ResponseInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
