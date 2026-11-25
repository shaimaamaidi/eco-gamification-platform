import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBadgeSection } from './admin-badge-section';

describe('AdminBadgeSection', () => {
  let component: AdminBadgeSection;
  let fixture: ComponentFixture<AdminBadgeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBadgeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBadgeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
