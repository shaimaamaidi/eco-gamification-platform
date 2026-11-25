import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientStatsSection } from './client-stats-section';

describe('ClientStatsSection', () => {
  let component: ClientStatsSection;
  let fixture: ComponentFixture<ClientStatsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientStatsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientStatsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
