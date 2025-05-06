import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { Event, Feedback, Participant, Resource } from '../models/event';
import { AuthService } from './auth.service';
import { EventStatus } from '../models/event-status';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:8081/api/events';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Current token:', token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEvents(): Observable<Event[]> {
    console.log('EventsService: Fetching events...');
    return this.http.get<Event[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map(events => this.ensureCorrectDateFormat(events)),
      tap(response => {
        console.log('EventsService: Response received:', response);
      }),
      catchError(error => {
        console.error('EventsService: Error fetching events:', error);
        throw error;
      })
    );
  }

  attendEvent(eventId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/attend/${userId}`, {}, { headers: this.getHeaders() });
  }
  
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      map(event => this.ensureCorrectDateFormat([event])[0]),
      map(event => this.ensureCorrectStatusFormat([event])[0]),
      map(event => this.normalizeEventRelations([event])[0]) // Add this line
    );
  }
  
  private ensureCorrectStatusFormat(events: Event[]): Event[] {
    return events.map(event => ({
      ...event,
      status: event.status.toUpperCase() as EventStatus
    }));
  }

  private ensureCorrectDateFormat(events: Event[]): Event[] {
    return events.map(event => {
      const normalizedEvent = { ...event };
      
      if (normalizedEvent.dateStart && !normalizedEvent.date_start) {
        normalizedEvent.date_start = normalizedEvent.dateStart;
      } else if (normalizedEvent.date_start && !normalizedEvent.dateStart) {
        normalizedEvent.dateStart = normalizedEvent.date_start;
      }
      
      if (normalizedEvent.dateEnd && !normalizedEvent.date_end) {
        normalizedEvent.date_end = normalizedEvent.dateEnd;
      } else if (normalizedEvent.date_end && !normalizedEvent.dateEnd) {
        normalizedEvent.dateEnd = normalizedEvent.date_end; 
      }
      
      if (normalizedEvent.private !== undefined && normalizedEvent.is_private === undefined) {
        normalizedEvent.is_private = normalizedEvent.private;
      }
      
      if (normalizedEvent.creatorId !== undefined && normalizedEvent.creator_id === undefined) {
        normalizedEvent.creator_id = normalizedEvent.creatorId;
      }
      
      if (normalizedEvent.salleId !== undefined && normalizedEvent.room_id === undefined) {
        normalizedEvent.room_id = normalizedEvent.salleId;
      }
      
      return normalizedEvent;
    });
  }

  addFeedback(
    eventId: number,
    userId: number,
    comment: string
  ): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/feedback`, {
      eventId,
      userId,
      comment,
    }, { headers: this.getHeaders() });
  }

  getEventFeedbacks(eventId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/${eventId}/feedbacks`, { headers: this.getHeaders() });
  }

  getEventParticipants(eventId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(
      `${this.apiUrl}/${eventId}/participants`,
      { headers: this.getHeaders() }
    );
  }

  createEvent(formData: FormData): Observable<Event> {
    console.log('Creating event with formData:', formData);
    const headers = this.getHeaders();
    console.log('Request headers:', headers);
    
    return this.http.post<Event>(this.apiUrl, formData, { 
      headers: headers,
      responseType: 'json' as const
    }).pipe(
      map(event => this.ensureCorrectDateFormat([event])[0]),
      tap(response => {
        console.log('Event created successfully:', response);
      }),
      catchError(error => {
        console.error('Error creating event:', error);
        throw error;
      })
    );
  }

  getEventImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }

  uploadEventImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<string>(`${this.apiUrl}/upload-image`, formData, { headers: this.getHeaders() });
  }
  getEventResources(eventId: number): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/${eventId}/resources`);
  }
  
  getPendingEvents(): Observable<Event[]> {
    
    return this.http.get<Event[]>(
      `${this.apiUrl}/pending`,
      { headers: this.getHeaders() }
    ); 
  }

  private normalizeEventRelations(events: Event[]): Event[] {
    return events.map(event => {
      // Create normalized creator object
      const creatorId = event.creator_id ?? event.creatorId ?? 0;
      const creator = event.creator ?? {
        id: creatorId,
        name: 'Unknown',
        email: '',
        phone: ''
      };
  
      // Create normalized location object
      const salleId = event.room_id ?? event.salleId ?? 0;
      const salle = event.salle ?? {
        id: salleId,
        name: 'Unknown',
        batiment: ''
      };
  
      return {
        ...event,
        creator,
        salle,
        // Clean up duplicate properties
        creator_id: undefined,
        creatorId: undefined,
        room_id: undefined,
        salleId: undefined
      };
    });
  }
  updateEventStatus(eventId: number, status: EventStatus): Observable<Event> {
    console.log(`Updating event ${eventId} status to ${status}`);
    const backendStatus = status.toLowerCase() as 'pending' | 'accepted' | 'rejected';
    return this.http.put<Event>(`${this.apiUrl}/${eventId}/status`, { status: backendStatus }).pipe(
      map(event => this.ensureCorrectDateFormat([event])[0]),
      tap(response => {
        console.log('Status update response:', response);
      }),
      catchError(error => {
        console.error('Error updating event status:', error);
        throw error;
      })
    );
  }

  getEventDetails(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`).pipe(
      map(event => this.ensureCorrectDateFormat([event])[0]),
      catchError(error => {
        console.error('Error fetching event details:', error);
        throw error;
      })
    );
  }
}