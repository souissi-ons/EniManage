import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../../common/popup/popup.component';
import { EventsService } from 'src/app/services/events.service';
import { AuthService } from 'src/app/services/auth.service';
import { Event } from 'src/app/models/event';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent, RouterLink],
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() event!: Event;
  @Output() updateNeeded = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<number>();
  
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
          this.loading = false;
        } else {
          this.error = 'User not authenticated';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to load user information';
        this.loading = false;
      }
    });
  }
  
  getImageUrl(): string {
    return this.event.imageUrl 
      ? this.eventsService.getEventImageUrl(this.event.imageUrl)
      : 'assets/default-event.png';
  }
  
  handleAttendClick() {
    if (!this.currentUserId) return;

    this.eventsService.attendEvent(this.event.id, this.currentUserId).subscribe({
      next: () => {
        this.event.isParticipating = true;
        this.event.currentParticipants = (this.event.currentParticipants || 0) + 1;
        this.updateNeeded.emit();
      },
      error: (error: Error) => console.error('Error attending event:', error),
    });
  }
  
  getButtonState(): string {
    const eventEndDate = this.event.dateEnd ? new Date(this.event.dateEnd) : null;
    if (!eventEndDate) return 'feedback';

    const now = new Date();
    now.setMinutes(now.getMinutes() - 1); // Buffer for edge cases
    return eventEndDate > now ? 'attend' : 'feedback';
  }
  
  handleViewDetails() {
    this.viewDetails.emit(this.event.id);
  }

  handleButtonClick() {
    if (this.getButtonState() === 'attend') {
      this.showConfirmModal = true;
    }
  }

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}