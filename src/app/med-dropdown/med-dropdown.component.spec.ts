import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedDropdownComponent } from './med-dropdown.component';

describe('MedDropdownComponent', () => {
  let component: MedDropdownComponent;
  let fixture: ComponentFixture<MedDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
