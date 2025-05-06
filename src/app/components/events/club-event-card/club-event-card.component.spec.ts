import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubEventCardComponent } from './club-event-card.component';

describe('ClubEventCardComponent', () => {
  let component: ClubEventCardComponent;
  let fixture: ComponentFixture<ClubEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubEventCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
