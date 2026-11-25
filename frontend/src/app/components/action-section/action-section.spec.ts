import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSection } from './action-section';

describe('ActionSection', () => {
  let component: ActionSection;
  let fixture: ComponentFixture<ActionSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
