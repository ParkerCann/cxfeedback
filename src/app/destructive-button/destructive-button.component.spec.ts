import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestructiveButtonComponent } from './destructive-button.component';

describe('DestructiveButtonComponent', () => {
  let component: DestructiveButtonComponent;
  let fixture: ComponentFixture<DestructiveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestructiveButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestructiveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
