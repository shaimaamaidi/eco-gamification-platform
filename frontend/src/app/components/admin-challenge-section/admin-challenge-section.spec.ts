import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChallengeSection } from './admin-challenge-section';

describe('AdminChallengeSection', () => {
  let component: AdminChallengeSection;
  let fixture: ComponentFixture<AdminChallengeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChallengeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChallengeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
