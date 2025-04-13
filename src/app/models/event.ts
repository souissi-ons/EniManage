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
}
