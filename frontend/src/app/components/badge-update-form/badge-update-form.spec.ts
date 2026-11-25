import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeUpdateForm } from './badge-update-form';

describe('BadgeUpdateForm', () => {
  let component: BadgeUpdateForm;
  let fixture: ComponentFixture<BadgeUpdateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeUpdateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeUpdateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
