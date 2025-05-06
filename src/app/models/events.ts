// src/app/models/events.ts

export type EventStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface EventResource {
  id: number;
  name: string;
  quantity: number;
}

export interface EventCreator {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface EventLocation {
  id: number;
  name: string;
  building?: string;
  capacity?: number;
}

export interface EventDetails {
  id: number;
  title: string;
  description: string;
  dateStart: string | Date;
  dateEnd: string | Date;
  isPrivate: boolean;
  capacity: number;
  status: EventStatus;
  creator: EventCreator;
  location: EventLocation;
  imageUrl?: string;
  logoUrl?: string;
  resources: EventResource[];
  currentParticipants?: number;
  canGiveFeedback?: boolean;
  isParticipating?: boolean;
}

export interface EventCard {
  id: number;
  title: string;
  dateStart: string | Date;
  dateEnd?: string | Date;
  status: EventStatus;
  imageUrl?: string;
  currentParticipants?: number;
  capacity: number;
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

export interface CreateEventRequest {
  title: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  isPrivate: boolean;
  capacity: number;
  creatorId: number;
  salleId: number;
  resources: {
    resourceId: number;
    quantity: number;
  }[];
  imageFile?: File;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: number;
  status?: EventStatus;
}

// Utility types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedEvents {
  events: EventDetails[];
  total: number;
  page: number;
  pageSize: number;
}