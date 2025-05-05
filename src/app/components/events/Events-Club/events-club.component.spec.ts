import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsClubComponent } from './events-club.component';

describe('EventsComponent', () => {
  let component: EventsClubComponent;
  let fixture: ComponentFixture<EventsClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsClubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
