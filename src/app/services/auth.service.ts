import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    console.log('AuthService: Initializing authentication...');
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken(token).subscribe({
        next: (isValid) => {
          if (isValid) {
            this.fetchCurrentUser().subscribe();
          }
        },
        error: (err) => {
          console.error('AuthService: Error loading user data:', err);
        },
      });
    }
  }

  fetchCurrentUser(): Observable<any> {
    console.log('AuthService: Fetching current user...');
    return this.http.get(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        console.error('AuthService: Error fetching current user:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log('AuthService: Token retrieved:', response.token);
          this.router.navigate(['/users']); // Navigate to /users after login
          return response;
        }
        return null;
      }),
      catchError((error) => {
        console.error('AuthService: Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // Navigate to /login after logout
  }

  private validateToken(token: string): Observable<boolean> {
    return this.http
      .post<{ valid: boolean }>(`${this.apiUrl}/validate-token`, { token })
      .pipe(
        map((response) => response.valid),
        catchError((error) => {
          console.error('AuthService: Token validation failed:', error);
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
