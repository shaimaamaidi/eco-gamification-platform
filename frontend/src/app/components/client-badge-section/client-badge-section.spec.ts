import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBadgeSection } from './client-badge-section';

describe('ClientBadgeSection', () => {
  let component: ClientBadgeSection;
  let fixture: ComponentFixture<ClientBadgeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBadgeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBadgeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
