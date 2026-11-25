import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChallengeSection } from './client-challenge-section';

describe('ClientChallengeSection', () => {
  let component: ClientChallengeSection;
  let fixture: ComponentFixture<ClientChallengeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientChallengeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientChallengeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
