import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../models/users';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  providers: [DatePipe],
})
export class EventCardComponent {
@Input() event!: Event;
@Output() viewDetails= new EventEmitter<number>();
handleAttendEvent(eventId: number) {
  console.log('Attend event clicked for event ID:', eventId);
}}
