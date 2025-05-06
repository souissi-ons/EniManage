import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.validateToken(token).subscribe({
        next: (isValid) => {
          if (isValid) {
            this.fetchCurrentUser().subscribe();
          } else {
            this.clearAuth();
          }
        },
        error: () => this.clearAuth(),
      });
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  fetchCurrentUser(): Observable<any> {
    console.log('AuthService: Fetching current user...');
    return this.http
      .get(`${this.apiUrl}/me`, { headers: this.getHeaders() })
      .pipe(
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
        catchError((error) => {
          console.error('AuthService: Error fetching current user:', error);
          return throwError(() => error);
        })
      );
  }

  // auth.service.ts
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.fetchCurrentUser().subscribe(() => {
            this.router.navigate(['/profile']);
          });
        }
      }),
      catchError((error) => {
        this.clearAuth();
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
      .post<{ valid: boolean }>(
        `${this.apiUrl}/validate-token`,
        { token },
        { headers: this.getHeaders() }
      )
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
