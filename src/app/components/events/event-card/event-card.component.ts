import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopupComponent } from '../../common/popup/popup.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent],
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() event!: Event;
  @Output() updateNeeded = new EventEmitter<void>();
  showConfirmModal = false;

  currentUserId: number | null = null;
  loading = true;
  error = '';

  constructor(
    private eventsService: EventsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.authService.currentUser$.subscribe({
      next: (user: any | null) => {
        this.currentUserId = user?.id || null;

        if (this.currentUserId) {
          console.log('User ID loaded:', this.currentUserId);
          this.loading = false;
        } else {
          console.error('No user ID found');
          this.error = 'User not authenticated';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error = 'Failed to load user information';
        this.loading = false;
      }
    });
  }

  getImageUrl(): string {
    if (this.event.imageUrl) {
      return this.eventsService.getEventImageUrl(this.event.imageUrl);
    }
    return 'assets/default-event.png';
  }

  handleAttendClick() {
    const eventDate = this.event.date_end ? new Date(this.event.date_end) : new Date();

    if (!this.currentUserId) {
      console.error('No user ID available for participation');
      return;
    }

    this.eventsService.attendEvent(this.event.id, this.currentUserId).subscribe({
      next: () => {
        this.event.isParticipating = true;
        this.event.currentParticipants = (this.event.currentParticipants || 0) + 1;
        this.updateNeeded.emit();
        this.showConfirmModal = false;
      },
      error: (error: Error) => console.error('Erreur participation:', error)
    });
  }

  getButtonState() {
    const eventDate = this.event.date_end ? new Date(this.event.date_end) : new Date();
    if (eventDate <= new Date()) {
      return 'feedback';
    }
    return this.event.isParticipating ? 'attending' : 'attend';
  }
}
