import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientSection } from './admin-client-section';

describe('AdminClientSection', () => {
  let component: AdminClientSection;
  let fixture: ComponentFixture<AdminClientSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClientSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
