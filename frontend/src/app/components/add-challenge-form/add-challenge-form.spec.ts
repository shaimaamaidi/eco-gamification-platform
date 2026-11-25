import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChallengeForm } from './add-challenge-form';

describe('AddChallengeForm', () => {
  let component: AddChallengeForm;
  let fixture: ComponentFixture<AddChallengeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChallengeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChallengeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
