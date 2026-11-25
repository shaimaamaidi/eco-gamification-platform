import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDetails } from './action-details';

describe('ActionDetails', () => {
  let component: ActionDetails;
  let fixture: ComponentFixture<ActionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
