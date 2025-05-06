// events.service.ts
import { Injectable } from '@angular/core';
import { EventStatus } from '../models/event-status';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { Event, Feedback, Participant } from '../models/event';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:8081/api/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Current token:', token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getEvents(): Observable<Event[]> {
    console.log('EventsService: Fetching events...');
    return this.http
      .get<Event[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(events => events.map(event => this.processEventDates(event))),
        tap((response) => {
          console.log('EventsService: Response received:', response);
        }),
        catchError((error) => {
          console.error('EventsService: Error fetching events:', error);
          throw error;
        })
      );
  }

  private processEventDates(event: Event): Event {
    console.log('Processing event dates:', {
      eventId: event.id,
      date_start: event.date_start,
    });

    // Ensure we have a valid date in date_start
    if (event.date_start) {
      const date = new Date(event.date_start);
      if (!isNaN(date.getTime())) {
        event.date_start = date.toISOString();
      }
    }

    // If date_start is not valid but startDate is, use startDate
    

    console.log('Processed event dates:', {
      eventId: event.id,
      date_start: event.date_start
    });

    return event;
  }

  attendEvent(eventId: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${eventId}/attend/${userId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getEventById(id: number): Observable<Event> {
    return this.http
      .get<Event>(`${this.apiUrl}/${id}`)
      .pipe(map((event) => this.ensureCorrectStatusFormat([event])[0]));
  }
  private ensureCorrectStatusFormat(events: Event[]): Event[] {
    return events.map((event) => ({
      ...event,
      status: event.status.toUpperCase() as EventStatus,
    }));
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

    return this.http
      .post<Event>(this.apiUrl, formData, {
        headers: headers,
        responseType: 'json' as const,
      })
      .pipe(
        tap((response) => {
          console.log('Event created successfully:', response);
        }),
        catchError((error) => {
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
    return this.http.post<string>(`${this.apiUrl}/upload-image`, formData, {
      headers: this.getHeaders(),
    });
  }
  getPendingEvents(): Observable<Event[]> {
    console.log('Fetching pending events...');
    return this.http.get<Event[]>(`${this.apiUrl}/pending`).pipe(
      tap((response) => {
        console.log('Pending events received:', response);
      }),
      catchError((error) => {
        console.error('Error fetching pending events:', error);
        throw error;
      })
    );
  }

  // Nouvelle méthode pour mettre à jour le statut d'un événement
  updateEventStatus(eventId: number, status: EventStatus): Observable<Event> {
    console.log(`Updating event ${eventId} status to ${status}`);
    const backendStatus = status.toLowerCase() as
      | 'pending'
      | 'accepted'
      | 'rejected';
    return this.http
      .put<Event>(`${this.apiUrl}/${eventId}/status`, { status: backendStatus })
      .pipe(
        tap((response) => {
          console.log('Status update response:', response);
        }),
        catchError((error) => {
          console.error('Error updating event status:', error);
          throw error;
        })
      );
  }

  // Nouvelle méthode pour récupérer les détails complets d'un événement
  getEventDetails(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`).pipe(
      catchError((error) => {
        console.error('Error fetching event details:', error);
        throw error;
      })
    );
  }

  addFeedback(feedbackData: any): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/feedback`, feedbackData, {
      headers: this.getHeaders(),
    });
  }

  getEventStats(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}/stats`, {
      headers: this.getHeaders(),
    });
  }
}
