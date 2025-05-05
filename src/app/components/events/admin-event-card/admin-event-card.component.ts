import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { EventStatus } from 'src/app/models/event-status';
import { SalleService } from 'src/app/services/salle.service';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { Salle } from 'src/app/models/salle';

@Component({
  selector: 'app-admin-event-card',
  templateUrl: './admin-event-card.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  styleUrls: ['./admin-event-card.component.css']
})
export class AdminEventCardComponent {
  @Input() event!: Event;
  @Output() viewDetails = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{eventId: number, status: EventStatus}>();
  selectedSalle: Salle | null = null;
  creator: Users | null = null; // Ajout de la propriété pour le créateur

  constructor(
    private salleService: SalleService,
    private userService: UsersService, 
    private eventsService: EventsService,
    private datePipe: DatePipe
  ) {}
  
  ngOnInit(): void {
    this.loadEventDetails();
    console.log("creator",this.event)
  }
  
  loadEventDetails(): void {
    // Charger les détails de la salle
    if (this.event.salleId) {
      this.salleService.getSalleById(this.event.salleId).subscribe({
        next: (salle) => {
          this.selectedSalle = salle;
        },
        error: (error) => console.error('Error loading salle details:', error)
      });
    }

    // Charger les détails du créateur
    if (this.event.creatorId) {
      this.userService.getUserById(this.event.creatorId).subscribe({
        next: (user :Users) => {
          this.creator = user;
        },
        error: (error: Error) => console.error('Error loading creator details:', error)
      });
    }
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

  acceptEvent(): void {
    this.statusChange.emit({eventId: this.event.id, status: 'ACCEPTED'});
  }

  rejectEvent(): void {
    this.statusChange.emit({eventId: this.event.id, status: 'REJECTED'});
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    
    try {
      // Handle ISO string dates
      if (typeof date === 'string' && date.includes('T')) {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return this.datePipe.transform(dateObj, 'MMM d, y, h:mm a') || 'N/A';
        }
      }
      
      // Handle Date objects
      if (date instanceof Date) {
        return this.datePipe.transform(date, 'MMM d, y, h:mm a') || 'N/A';
      }
      
      // Last attempt with regular Date constructor
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return this.datePipe.transform(dateObj, 'MMM d, y, h:mm a') || 'N/A';
      }
    } catch (error) {
      console.error('Error formatting date:', error);
    }
    
    return 'Invalid date';
  }

  getParticipationPercentage(): number {
    if (!this.event.currentParticipants || !this.event.capacity) return 0;
    return Math.min(100, Math.round((this.event.currentParticipants / this.event.capacity) * 100));
  }

  getParticipationColorClass(): string {
    const percentage = this.getParticipationPercentage();
    if (percentage < 30) return 'bg-blue-500';
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  
  getResourceCount(): number {
    return this.event.resources?.length || 0;
  }
  
  hasResources(): boolean {
    return !!this.event.resources && this.event.resources.length > 0;
  }
}