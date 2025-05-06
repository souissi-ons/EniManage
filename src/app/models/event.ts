// src/app/models/event.ts
import { EventStatus } from './event-status';

export interface Creator {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Salle {
  id: number;
  name: string;
  batiment?: string;
  capacity?: number;
}

export interface Resource {
  resourceId: number;  // Changed from 'id'
  resourceName: string; // Changed from 'name'
  quantity: number;
  eventId: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  
  // Handle both naming conventions
  date_start?: string | Date;
  date_end?: string | Date;
  dateStart?: string | Date;
  dateEnd?: string | Date;
  
  // Handle both naming conventions for private flag
  is_private?: boolean;
  private?: boolean;
  
  capacity: number;
  status: EventStatus;
  
  // Creator can come as an object or just an ID
  creator?: Creator;
  creator_id?: number;
  creatorId?: number;
  
  // Salle/room can come as an object or just an ID
  salle?: Salle;
  room_id?: number;
  salleId?: number;
  
  imageUrl?: string;
  resources?: Resource[];
  
  // Additional fields for frontend use
  currentParticipants?: number;
  isParticipating?: boolean;
  canGiveFeedback?: boolean;
}

export interface Feedback {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  comment: string;
  createdAt: Date;
}

export interface Participant {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  joinedAt: Date;
}