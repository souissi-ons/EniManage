// events.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Event, Feedback, Participant } from '../models/event';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:8081/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    console.log('EventsService: Fetching events...');
    return this.http.get<Event[]>(this.apiUrl).pipe(
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
    return this.http.post(`${this.apiUrl}/${eventId}/attend/${userId}`, {});
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
    });
  }

  getEventFeedbacks(eventId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/${eventId}/feedbacks`);
  }

  getEventParticipants(eventId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(
      `${this.apiUrl}/${eventId}/participants`
    );
  }

  createEvent(eventData: any): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData);
  }

  getEventImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }

  uploadEventImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<string>(`${this.apiUrl}/upload-image`, formData);
  }
}
