import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingItem } from './ranking-item';

describe('RankingItem', () => {
  let component: RankingItem;
  let fixture: ComponentFixture<RankingItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
