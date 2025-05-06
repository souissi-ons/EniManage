import { Component, OnInit } from '@angular/core';
import { Event } from '../../../models/event';
import { EventsService } from '../../../services/events.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PopupComponent } from "../../common/popup/popup.component";
import { RequestEventComponent } from "../request-event/request-event.component";
import { ClubEventCardComponent } from '../club-event-card/club-event-card.component';
import { Users } from '../../../models/users';

@Component({
  selector: 'app-events-club',
  templateUrl: './events-club.component.html',
  styleUrls: ['./events-club.component.css'],
  standalone: true,
  imports: [CommonModule, ClubEventCardComponent, PopupComponent, RequestEventComponent],
})
export class EventsClubComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error: string | null = null;
  showRequestEventPopup = false;
  currentUserId: number | null = null;

  constructor(
    private eventsService: EventsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.authService.currentUser$.subscribe({
      next: (user: Users | null) => {
        this.currentUserId = user?.id || null;
        if (this.currentUserId) {
          this.loadEvents();
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

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.eventsService.getEvents().subscribe({
      next: (data) => {
        console.log('Events loaded:', data); // Debug logging
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.error = 'An error occurred while loading events.';
        this.loading = false;
      }
    });
  }

  handleViewDetails(eventId: number) {
    console.log('View details for event ID:', eventId);
    // Add navigation or modal logic here
  }

  handleRequestEvent() {
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