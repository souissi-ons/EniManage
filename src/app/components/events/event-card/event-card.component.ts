import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  @Output() viewDetails = new EventEmitter<number>();
  
  showConfirmModal = false;
  showFeedbackModal = false;
  feedbackComment = '';      
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
        this.event.currentParticipants = (this.event.currentParticipants || 0) + 1;
        this.updateNeeded.emit();
        console.log('Successfully added to participants');
      },
      error: (error: Error) => console.error('Error attending event:', error),
    });
  }
  
  getButtonState(): string {
    const eventEndDate = this.event.date_end ? new Date(this.event.date_end) : null;
    
    if (!eventEndDate) {
      console.warn('No valid end date found for event:', this.event);
      return 'feedback';
    }
  
    const now = new Date();
    now.setMinutes(now.getMinutes() - 1); // Buffer for edge cases
    return eventEndDate > now ? 'attend' : 'feedback';
  }
  
  handleGiveFeedback() {
    this.showFeedbackModal = true;
  }
  
  submitFeedback() {
    // TODO: Implement actual feedback logic
    console.log('Submitting feedback:', this.feedbackComment);
    // After submission is successful:
    this.closeFeedbackModal();
  }
  
  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackComment = '';
  }
  
  handleViewDetails() {
    this.viewDetails.emit(this.event.id);
  }
  handleButtonClick() {
    const buttonState = this.getButtonState();
    if (buttonState === 'attend') {
            this.showConfirmModal = true;
    } else if (buttonState === 'feedback') {
      this.handleGiveFeedback();
    }
  }
  // Format date to a readable string
  formatDate(dateString: string | Date): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      }
}
