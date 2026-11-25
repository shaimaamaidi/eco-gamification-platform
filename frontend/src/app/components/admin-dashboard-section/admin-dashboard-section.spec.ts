import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSection } from './admin-dashboard-section';

describe('AdminDashboardSection', () => {
  let component: AdminDashboardSection;
  let fixture: ComponentFixture<AdminDashboardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
