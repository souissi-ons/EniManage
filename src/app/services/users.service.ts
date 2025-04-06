import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl: string = 'http://localhost:8081/api/users';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId: number, user: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, user);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  uploadLogo(file: File): Observable<string> {
    const fileName = `club-logo-${Date.now()}.${file.name.split('.').pop()}`;
    return of(fileName);
  }

  getUserImageUrl(filename: string): string {
    return `${this.apiUrl}/images/${filename}`;
  }
}
