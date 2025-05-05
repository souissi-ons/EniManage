import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
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
    // Add debug logging
    console.log('Current token:', localStorage.getItem('token'));

    return this.http.patch<any>(`${this.apiUrl}/${userId}`, user).pipe(
      tap((response) => console.log('Update successful:', response)),
      catchError((error) => {
        console.error('Update error:', error);
        return throwError(() => error);
      })
    );
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
