import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionForm } from './add-action-form';

describe('AddActionForm', () => {
  let component: AddActionForm;
  let fixture: ComponentFixture<AddActionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddActionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
