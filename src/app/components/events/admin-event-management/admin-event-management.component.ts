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
  selectedEvent: Event | null = null;
  showDetailsModal = false;
  loading = true;
  error = '';

  constructor(
    public eventsService: EventsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadPendingEvents();
  }

  loadPendingEvents(): void {
    this.loading = true;
    this.error = '';
    
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
    console.log('Formatting date:', date);
    if (!date) return 'N/A';
    
    if (typeof (date) === 'string' && date.includes('T')) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return this.datePipe.transform(dateObj, 'medium') || 'N/A';
        }
      } catch (error) {
        console.error('Error parsing ISO date:', error);
      }
    }
    
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'medium') || 'N/A';
    }
    
    return 'Invalid date format';
  }

  handleViewDetails(eventId: number): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        this.selectedEvent = {
          ...event,
          dateStart: event.dateStart ,
          dateEnd: event.dateEnd ,
          
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
    // Supprimer l'événement localement avant de recharger
    this.pendingEvents = this.pendingEvents.filter(event => event.id !== data.eventId);

    this.eventsService.updateEventStatus(data.eventId, data.status).subscribe({
      next: () => {
        // Recharger la liste complète après modification
        this.loadPendingEvents();
      },
      error: (error) => console.error('Error updating event status:', error)
    });
  }

  updateEventStatus(eventId: number, status: EventStatus): void {
    this.handleStatusChange({ eventId, status });
  }
}