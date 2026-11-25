import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecompenseForm } from './add-recompense-form';

describe('AddRecompenseForm', () => {
  let component: AddRecompenseForm;
  let fixture: ComponentFixture<AddRecompenseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecompenseForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecompenseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
