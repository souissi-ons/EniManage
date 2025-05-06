import { Component, OnInit } from '@angular/core';
import { Event } from '../../../models/event';
import { EventsService } from '../../../services/events.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

handleViewDetails(eventId: number) {
    console.log('View details for event ID:', eventId);
  }
  handleRequestEvent() {
    console.log('Request event clicked');
  }
}