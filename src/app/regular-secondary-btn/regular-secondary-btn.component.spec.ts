import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularSecondaryBtnComponent } from './regular-secondary-btn.component';

describe('RegularSecondaryBtnComponent', () => {
  let component: RegularSecondaryBtnComponent;
  let fixture: ComponentFixture<RegularSecondaryBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularSecondaryBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularSecondaryBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
