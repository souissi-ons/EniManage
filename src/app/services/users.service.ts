import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Membership } from '../models/users';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl: string = 'http://localhost:8081/api/users';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

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

  updateUserPassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}/password`, {
      currentPassword,
      newPassword,
    });
  }

  getClubMembers(clubId: number): Observable<any[]> {
    console.log('Fetching club memberships for club ID:', clubId);
    // Utilise l'endpoint existant memberships et transforme les données
    return this.http
      .get<Membership[]>(`${this.apiUrl}/${clubId}/memberships`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((memberships) => console.log('Memberships received:', memberships)),
        catchError((error) => {
          console.error('Error fetching club memberships:', error);
          if (error.error) {
            console.error('Error details:', error.error);
          }
          return throwError(() => error);
        })
      );
  }

  // Récupérer les étudiants non membres
  getNonMemberStudents(clubId: number): Observable<Users[]> {
    console.log(
      'Implementing custom fetch for non-member students for club ID:',
      clubId
    );
    // Nous devrons implémenter cet endpoint côté backend
    // Pour le moment, utilisons un contournement
    return this.getUsers().pipe(
      tap((users) => console.log('All users received:', users)),
      map((users) => users.filter((user: Users) => user.role === 'STUDENT')),
      // Filtrer les membres existants
      switchMap((students) => {
        return this.getClubMembers(clubId).pipe(
          map((memberships) => {
            const memberIds = memberships.map((m) => m.student.id);
            return students.filter(
              (student: Users) => !memberIds.includes(student.id)
            );
          })
        );
      }),
      tap((nonMembers) => console.log('Non-members filtered:', nonMembers)),
      catchError((error) => {
        console.error('Error processing non-members:', error);
        return throwError(() => error);
      })
    );
  }

  getMembershipsByClub(clubId: number): Observable<Membership[]> {
    return this.http
      .get<Membership[]>(`${this.apiUrl}/${clubId}/memberships`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log('Memberships loaded:', response)),
        catchError((error) => {
          console.error('Error loading memberships:', error);
          return throwError(() => error);
        })
      );
  }

  addMemberToClub(clubId: number, studentId: number): Observable<any> {
    console.log(`Adding student ${studentId} to club ${clubId}`);
    // Appel à la méthode à implémenter côté backend
    return this.http
      .post<any>(
        `${this.apiUrl}/${clubId}/members/${studentId}`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => console.log('Member added:', response)),
        catchError((error) => {
          console.error('Error adding member:', error);
          return throwError(() => error);
        })
      );
  }

  removeMemberFromClub(clubId: number, membershipId: number): Observable<void> {
    console.log(`Removing membership ${membershipId} from club ${clubId}`);
    // Appel à la méthode à implémenter côté backend
    return this.http
      .delete<void>(`${this.apiUrl}/${clubId}/memberships/${membershipId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(() => console.log('Member removed')),
        catchError((error) => {
          console.error('Error removing member:', error);
          return throwError(() => error);
        })
      );
  }
}
