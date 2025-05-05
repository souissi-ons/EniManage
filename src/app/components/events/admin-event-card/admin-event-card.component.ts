import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { EventStatus } from 'src/app/models/event-status';

@Component({
  selector: 'app-admin-event-card',
  templateUrl: './admin-event-card.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./admin-event-card.component.css']
})
export class AdminEventCardComponent {
  @Input() event!: Event;
  @Output() viewDetails = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{eventId: number, status: EventStatus}>();

  constructor(private eventsService: EventsService) {}

  getImageUrl(filename: string | undefined): string {
    if (filename) {
      return this.eventsService.getEventImageUrl(filename);
    }
    return 'assets/default-event.png';
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/default-event.png';
  }

  acceptEvent(): void {
    this.statusChange.emit({eventId: this.event.id, status: 'ACCEPTED'});
  }

  rejectEvent(): void {
    this.statusChange.emit({eventId: this.event.id, status: 'REJECTED'});
  }
}