import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionStatsSection } from './action-stats-section';

describe('ActionStatsSection', () => {
  let component: ActionStatsSection;
  let fixture: ComponentFixture<ActionStatsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionStatsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionStatsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
