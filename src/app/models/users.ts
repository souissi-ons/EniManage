export interface Users {
  id: number;
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  birthDate: Date;
  role: 'STUDENT' | 'CLUB' | 'TEACHER' | 'ADMIN';
  description?: string;
  logo?: string;
}

export interface Event {

  id: number;
  imageUrl: string;
  request_id : number;
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
