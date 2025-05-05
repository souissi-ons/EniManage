import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { EventStatus } from 'src/app/models/event-status';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';
import { DatePipe } from '@angular/common';

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

  constructor(
    public eventsService: EventsService,
    private datePipe: DatePipe
  ) {}

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
    console.log('Original date value type:', typeof date, 'Value:', date);
    
    if (!date) return 'N/A';
    
    // Si la date est déjà un objet Date
    if (date instanceof Date) {
      const formattedDate = this.datePipe.transform(date, 'medium');
      console.log('Already Date object, formatted:', formattedDate);
      return formattedDate || 'N/A';
    }
    
    // Si la date est une chaîne de caractères
    if (typeof date === 'string') {
      try {
        // Essayer plusieurs formats de date
        let dateObj;
        
        // Format MySQL: 2023-12-15 09:00:00.000000
        if (date.includes(' ') && date.includes('-') && date.includes(':')) {
          const [datePart, timePart] = date.split(' ');
          console.log('Parsed date parts:', datePart, timePart);
          
          // Créer la date manuellement
          const [year, month, day] = datePart.split('-').map(Number);
          const [hours, minutes, secondsWithMs] = timePart.split(':').map(val => parseFloat(val));
          const seconds = Math.floor(secondsWithMs);
          
          console.log('Parsed components:', year, month, day, hours, minutes, seconds);
          
          // Les mois dans JavaScript sont indexés à partir de 0 (0=janvier)
          dateObj = new Date(year, month-1, day, hours, minutes, seconds);
        } else {
          // Essayer le format standard
          dateObj = new Date(date);
        }
        
        console.log('Converted to date object:', dateObj);
        
        if (!isNaN(dateObj.getTime())) {
          const formattedDate = this.datePipe.transform(dateObj, 'medium');
          console.log('Formatted date:', formattedDate);
          return formattedDate || 'N/A';
        } else {
          console.error('Invalid date after conversion');
          return 'Invalid date format';
        }
      } catch (error) {
        console.error('Error parsing date:', error);
        return 'Error parsing date';
      }
    }
    
    // Si la date n'est ni une chaîne ni un objet Date
    console.error('Unexpected date type:', typeof date);
    return 'Unknown date format';
  }

  ngOnInit(): void {
    this.loadPendingEvents();
  }

  loadPendingEvents(): void {
    this.eventsService.getPendingEvents().subscribe({
      next: (events) => {
        this.pendingEvents = events;
        console.log('Pending events loaded:', events);
      },
      error: (error) => console.error('Error loading pending events:', error)
    });
  }

  handleViewDetails(eventId: number): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        // Afficher l'objet événement brut pour débogage
        console.log('Raw event object received:', event);
        console.log('Raw event as JSON:', JSON.stringify(event));
        
        // Vérifier toutes les propriétés possibles pour les dates
        console.log('Checking all possible date properties:');
        const propertiesToCheck = [
          'date_start', 'dateStart', 'start_date', 'startDate', 
          'date_end', 'dateEnd', 'end_date', 'endDate',
          'startTime', 'endTime', 'start', 'end'
        ];
        
        // If you're sure the properties exist but TypeScript doesn't know about them
propertiesToCheck.forEach(prop => {
  console.log(`Property "${prop}":`, (event as any)[prop]);
});
        
        this.selectedEvent = event;
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
        this.loadPendingEvents();
        if (this.selectedEvent?.id === data.eventId) {
          this.closeDetailsModal();
        }
      },
      error: (error) => console.error('Error updating event status:', error)
    });
  }
}