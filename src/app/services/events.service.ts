import { Injectable } from '@angular/core';
import { Event } from '../models/users';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }
  private events: Event[] = [
    {
      id: 1,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGakkUEbXyfann4M16v9CV-sTa915cUOdh9g&s',
      request_id: 101,
      title: 'Angular Workshop',
      description: 'Learn Angular fundamentals with hands-on exercises',
      date_start: new Date('2023-12-15'),
      date_end: new Date('2023-12-17'),
      is_private: false,
      capacity: 30,
      status: 'accepted',
      creator_id: 1,
      room_id: 5
    },
    {
      id: 2,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReDzgb8AHDGZYqZtUePav2qPIFqrhE-KjhRw&s',
      request_id: 102,
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development intensive course',
      date_start: new Date('2024-01-10'),
      date_end: new Date('2024-01-20'),
      is_private: true,
      capacity: 20,
      status: 'accepted',
      creator_id: 2,
      room_id: 3
    },
    {
      id: 3,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGakkUEbXyfann4M16v9CV-sTa915cUOdh9g&s',
      request_id: 103,
      title: 'Angular Workshop',
      description: 'Learn Angular fundamentals with hands-on exercises',
      date_start: new Date('2023-12-15'),
      date_end: new Date('2023-12-17'),
      is_private: false,
      capacity: 30,
      status: 'accepted',
      creator_id: 1,
      room_id: 6
    },
    {
      id: 4,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReDzgb8AHDGZYqZtUePav2qPIFqrhE-KjhRw&s',
      request_id: 104,
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development intensive course',
      date_start: new Date('2024-01-10'),
      date_end: new Date('2024-01-20'),
      is_private: true,
      capacity: 20,
      status: 'accepted',
      creator_id: 4,
      room_id: 1
    },
  ];
  getEvents() : Observable<Event[]> {
    return of(this.events);
  }

}
