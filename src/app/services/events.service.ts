// events.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Event, Feedback, Participant } from '../models/event';
import { AuthService } from './auth.service';

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
}
