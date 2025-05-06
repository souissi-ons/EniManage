import { EventStatus } from "./event-status";

// event.model.ts
export interface Event {
  id: number;
  imageUrl?: string;
  request_id?: number;
  title: string;
  description: string;
  date_start?: Date | string;
  date_end?: Date | string;
   
  is_private: boolean;
  capacity: number;
  creator_id: number;
  room_id: number;
  currentParticipants?: number;
  canGiveFeedback?: boolean;
  isParticipating?: boolean;
  status: EventStatus;
}

export interface Feedback {
  id: number;
  event_id: number;
  user_id: number;
  comment: string;
  date_creation: Date;
  user_name?: string;
}

export interface Participant {
  id: number;
  event_id: number;
  user_id: number;
  date_inscription: Date;
  user_name?: string;
}

export interface EventResource {

resourceId: number;
quantity: number;
resourceName?: string;
}