import { Component, OnInit } from '@angular/core';
import { Event } from '../../../models/event';
import { EventsService } from '../../../services/events.service';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { AuthService } from '../../../services/auth.service';
import { PopupComponent } from "../../common/popup/popup.component";
import { RequestEventComponent } from "../request-event/request-event.component";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: true,
  imports: [CommonModule, EventCardComponent, PopupComponent, RequestEventComponent],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error: string | null = null;
  showRequestEventPopup = false;

  constructor(
    private eventsService: EventsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('EventsComponent: Initializing...');
    this.loadEvents();
  }

  loadEvents(): void {
    console.log('EventsComponent: Loading events...');
    this.loading = true;
    this.error = null;

    this.eventsService.getEvents().subscribe({
      next: (data) => {
        console.log('EventsComponent: Events loaded successfully:', data);
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('EventsComponent: Error loading events:', error);
        this.error = 'Une erreur est survenue lors du chargement des événements.';
        this.loading = false;
      }
    });
  }

  handleViewDetails(eventId: number) {
    console.log('View details for event ID:', eventId);
  }

  handleRequestEvent() {
    console.log('Request event clicked');
    this.showRequestEventPopup = true;
  } 

  closeRequestEventPopup() {
    this.showRequestEventPopup = false;
    this.loadEvents();
  }

  handleEventRequested() {
    this.showRequestEventPopup = false;
    this.loadEvents();
  }
}
