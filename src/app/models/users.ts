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
