import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDashboardSection } from './client-dashboard-section';

describe('ClientDashboardSection', () => {
  let component: ClientDashboardSection;
  let fixture: ComponentFixture<ClientDashboardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDashboardSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDashboardSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
