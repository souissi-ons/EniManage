import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-club-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './club-event-card.component.html',
  styleUrls: ['./club-event-card.component.css']
})
export class ClubEventCardComponent {
  @Input() event!: Event;
  @Output() viewDetails = new EventEmitter<number>();

  constructor(private eventsService: EventsService , private router: Router) {}

  isEventDone(): boolean {
    if (!this.event?.dateEnd) return false;
    const endDate = new Date(this.event.dateEnd);
    const today = new Date();
    return endDate < today;
  }
  // club-event-card.component.ts
handleCardClick() {
  if (this.isEventDone()) {
    // Convert to number and validate
    const eventId = Number(this.event.id);
    if (!isNaN(eventId)) {
      this.router.navigate(['/event', eventId, 'status']);
    } else {
      console.error('Invalid event ID:', this.event.id);
      // Show error to user
    }
  }
}

  getImageUrl(): string {
    return this.event.imageUrl
      ? this.eventsService.getEventImageUrl(this.event.imageUrl)
      : 'assets/default-event.png';
  }

  handleViewDetails(event: MouseEvent) {
    event.stopPropagation(); // Prevent card click from triggering
    this.viewDetails.emit(this.event.id);
  }
  get eventStatusClass() {
    return {
      'bg-green-100 text-green-800': this.event.status === 'ACCEPTED',
      'bg-yellow-100 text-yellow-800': this.event.status === 'PENDING',
      'bg-red-100 text-red-800': this.event.status === 'REJECTED'
    };
  }
}
