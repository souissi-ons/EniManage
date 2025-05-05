import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { EventStatus } from 'src/app/models/event-status';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';

@Component({
  selector: 'app-admin-event-management',
  templateUrl: './admin-event-management.component.html',
  standalone: true,
  imports: [CommonModule, AdminEventCardComponent],
  providers: [DatePipe],
  styleUrls: ['./admin-event-management.component.css']
})
export class AdminEventManagementComponent implements OnInit {
  pendingEvents: Event[] = [];
  acceptedEvents: Event[] = [];
  rejectedEvents: Event[] = [];
  selectedEvent: Event | null = null;
  showDetailsModal = false;
  loading = true;
  error = '';
  activeTab: 'pending' | 'accepted' | 'rejected' = 'pending';

  constructor(
    public eventsService: EventsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = '';
    
    // Load pending events initially
    this.loadPendingEvents();
    
    // Load other event types if needed
    if (this.activeTab === 'accepted') {
      this.loadAcceptedEvents();
    } else if (this.activeTab === 'rejected') {
      this.loadRejectedEvents();
    }
  }

  loadPendingEvents(): void {
    this.eventsService.getPendingEvents().subscribe({
      next: (events) => {
        this.pendingEvents = events;
        this.loading = false;
        console.log('Pending events loaded:', events);
      },
      error: (error) => {
        console.error('Error loading pending events:', error);
        this.error = 'Failed to load pending events. Please try again.';
        this.loading = false;
      }
    });
  }

  // Additional methods to load accepted/rejected events if needed
  loadAcceptedEvents(): void {
    // Implementation would depend on your API
    // For example: this.eventsService.getEventsByStatus('ACCEPTED')
  }

  loadRejectedEvents(): void {
    // Implementation would depend on your API
    // For example: this.eventsService.getEventsByStatus('REJECTED')
  }

  changeTab(tab: 'pending' | 'accepted' | 'rejected'): void {
    if (this.activeTab === tab) return;
    
    this.activeTab = tab;
    this.loadEvents();
  }

  getImageUrl(filename: string | undefined): string {
    if (filename) {
      return this.eventsService.getEventImageUrl(filename);
    }
    return 'assets/default-event.png';
  }
  
  handleImageError(event: any): void {
    event.target.src = 'assets/default-event.png';
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    
    // Handle ISO string dates from API (most common case from backend)
    if (typeof date === 'string' && date.includes('T')) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return this.datePipe.transform(dateObj, 'medium') || 'N/A';
        }
      } catch (error) {
        console.error('Error parsing ISO date:', error);
      }
    }
    
    // Handle Date objects
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'medium') || 'N/A';
    }
    
    // Handle MySQL date format: 2023-12-15 09:00:00.000000
    if (typeof date === 'string' && date.includes(' ') && date.includes('-') && date.includes(':')) {
      try {
        const [datePart, timePart] = date.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, secondsWithMs] = timePart.split(':').map(val => parseFloat(val));
        const seconds = Math.floor(secondsWithMs);
        
        // Months in JavaScript are indexed from 0 (0=January)
        const dateObj = new Date(year, month-1, day, hours, minutes, seconds);
        
        if (!isNaN(dateObj.getTime())) {
          return this.datePipe.transform(dateObj, 'medium') || 'N/A';
        }
      } catch (error) {
        console.error('Error parsing MySQL date:', error);
      }
    }
    
    // Last attempt with regular Date constructor
    try {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return this.datePipe.transform(dateObj, 'medium') || 'N/A';
      }
    } catch (error) {
      console.error('Error in last resort date parsing:', error);
    }
    
    return 'Invalid date format';
  }

  handleViewDetails(eventId: number): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        this.selectedEvent = {
          ...event,
          // Ensure both naming conventions are available
          date_start: event.date_start || event.dateStart,
          date_end: event.date_end || event.dateEnd,
          dateStart: event.dateStart || event.date_start,
          dateEnd: event.dateEnd || event.date_end
        };
        this.showDetailsModal = true;
      },
      error: (error) => console.error('Error loading event details:', error)
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEvent = null;
  }

  handleStatusChange(data: { eventId: number, status: EventStatus }): void {
    this.eventsService.updateEventStatus(data.eventId, data.status).subscribe({
      next: () => {
        // Reload events based on active tab
        this.loadEvents();
        
        if (this.selectedEvent?.id === data.eventId) {
          this.closeDetailsModal();
        }
      },
      error: (error) => console.error('Error updating event status:', error)
    });
  }
}