import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecompenseUpdateForm } from './recompense-update-form';

describe('RecompenseUpdateForm', () => {
  let component: RecompenseUpdateForm;
  let fixture: ComponentFixture<RecompenseUpdateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecompenseUpdateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecompenseUpdateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
