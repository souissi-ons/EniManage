// event-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent {
  @Input() event!: Event;
  @Output() updateNeeded = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<number>();
  showFeedbackModal = false;
  feedbackComment = '';

  constructor(private eventsService: EventsService) {}

  getImageUrl(): string {
    if (this.event.imageUrl) {
      return this.eventsService.getEventImageUrl(this.event.imageUrl);
    }
    return 'assets/default-event.png';
  }

  handleAttendEvent(eventId: number) {
    const userId = 1;
    this.eventsService.attendEvent(eventId, userId).subscribe({
      next: () => {
        this.event.isParticipating = true;
        this.event.currentParticipants =
          (this.event.currentParticipants || 0) + 1;
        this.updateNeeded.emit();
      },
      error: (error: Error) => console.error('Erreur participation:', error),
    });
  }

  handleGiveFeedback() {
    this.showFeedbackModal = true;
  }

  submitFeedback() {}

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackComment = '';
  }

  handleViewDetails() {
    this.viewDetails.emit(this.event.id);
  }

  get eventStatusClass() {
    return {
      'bg-green-100 text-green-800': this.event.status === 'ACCEPTED',
      'bg-yellow-100 text-yellow-800': this.event.status === 'PENDING',
      'bg-red-100 text-red-800': this.event.status === 'REJECTED',
    };
  }
}
