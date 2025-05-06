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
  @Output() viewDetails = new EventEmitter<number>(); // 🛠️ Declare properly

  showConfirmModal = false;
  showFeedbackModal = false; // 🛠️ Fix: Declare missing property
  feedbackComment = '';      // 🛠️ Fix: Declare missing property

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
    if (!this.currentUserId) {
      console.error('No user ID available for participation');
      return;
    }

    this.eventsService.attendEvent(this.event.id, this.currentUserId).subscribe({
      next: () => {
        this.event.isParticipating = true;
        this.event.currentParticipants =
          (this.event.currentParticipants || 0) + 1;
        this.updateNeeded.emit();
        this.showConfirmModal = false;
      },
      error: (error: Error) => console.error('Erreur participation:', error),
    });
  }

  handleGiveFeedback() {
    this.showFeedbackModal = true;
  }
  
  submitFeedback() {
    // TODO: Implement actual feedback logic
  }
  
  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackComment = '';
  }
  
  handleViewDetails() {
    this.viewDetails.emit(this.event.id);
  }
  
  getEventDate(): string {
    // Try both property names
    const startDate = this.event.date_start || this.event.dateStart;
    
    if (!startDate) return 'N/A';
    
    try {
      const dateObj = new Date(startDate);
      if (!isNaN(dateObj.getTime())) {
        return this.datePipe.transform(dateObj, 'shortDate') || 'N/A';
      }
    } catch (error) {
      console.error('Error formatting event date:', error);
    }
    
    return 'N/A';
  }
  
  get eventStatusClass() {
    return {
      'bg-green-100 text-green-800': this.event.status === 'ACCEPTED',
      'bg-yellow-100 text-yellow-800': this.event.status === 'PENDING',
      'bg-red-100 text-red-800': this.event.status === 'REJECTED',
    };
  }
}
