export interface Users {
  id: number;
  name: string;
  role: 'student' | 'club' | 'teacher';
  email: string;
}
