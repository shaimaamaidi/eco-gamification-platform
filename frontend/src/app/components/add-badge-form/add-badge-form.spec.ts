import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBadgeForm } from './add-badge-form';

describe('AddBadgeForm', () => {
  let component: AddBadgeForm;
  let fixture: ComponentFixture<AddBadgeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBadgeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBadgeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
