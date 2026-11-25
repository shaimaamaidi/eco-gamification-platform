import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeUpdateForm } from './challenge-update-form';

describe('ChallengeUpdateForm', () => {
  let component: ChallengeUpdateForm;
  let fixture: ComponentFixture<ChallengeUpdateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeUpdateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeUpdateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
