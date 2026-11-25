import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDots } from './loading-dots';

describe('LoadingDots', () => {
  let component: LoadingDots;
  let fixture: ComponentFixture<LoadingDots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingDots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingDots);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
