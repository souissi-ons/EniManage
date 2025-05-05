import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';

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

  constructor(private eventsService: EventsService) {}

  getImageUrl(): string {
    return this.event.imageUrl
      ? this.eventsService.getEventImageUrl(this.event.imageUrl)
      : 'assets/default-event.png';
  }

  handleViewDetails() {
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
