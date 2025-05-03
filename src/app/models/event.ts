// event.model.ts
export interface Event {
  id: number;
  imageUrl: string;
  request_id: number;
  title: string;
  description: string;
  date_start: Date;
  date_end: Date;
  is_private: boolean;
  capacity: number;
  status: 'pending' | 'accepted' | 'rejected';
  creator_id: number;
  room_id: number;
  currentParticipants?: number;
  canGiveFeedback?: boolean;
  isParticipating?: boolean;
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
