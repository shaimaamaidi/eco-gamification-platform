import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRecompenseSection } from './client-recompense-section';

describe('ClientRecompenseSection', () => {
  let component: ClientRecompenseSection;
  let fixture: ComponentFixture<ClientRecompenseSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRecompenseSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRecompenseSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
