import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecompenseSection } from './admin-recompense-section';

describe('AdminRecompenseSection', () => {
  let component: AdminRecompenseSection;
  let fixture: ComponentFixture<AdminRecompenseSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecompenseSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecompenseSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
