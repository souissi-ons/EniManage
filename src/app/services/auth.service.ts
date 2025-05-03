import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

 // auth.service.ts
private initializeAuth() {
  console.log('AuthService: Initializing authentication...');
  const token = localStorage.getItem('token');
  
  if (token) {
    // Mettre immédiatement isAuthenticated à true
    this.isAuthenticatedSubject.next(true);
    
    // Charger les données utilisateur en arrière-plan
    this.getCurrentUser().subscribe({
      next: (user) => {
        console.log('AuthService: User data loaded successfully:', user);
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('AuthService: Error loading user data:', error);
        // En cas d'erreur, considérer que le token est invalide
        this.logout();
      }
    });
  } else {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }
}
  login(email: string, password: string): Observable<any> {
    console.log('AuthService: Attempting login...');
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('AuthService: Login response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
          this.getCurrentUser().subscribe({
            next: (user) => {
              console.log('AuthService: User data after login:', user);
              this.currentUserSubject.next(user);
            },
            error: (error) => {
              console.error('AuthService: Error fetching user data after login:', error);
            }
          });
        }
      })
    );
  }

  logout(): void {
    console.log('AuthService: Logging out...');
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<any> {
    console.log('AuthService: Fetching current user...');
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => {
        console.log('AuthService: Current user data:', user);
        this.currentUserSubject.next(user);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUserValue(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
validateToken(): Observable<boolean> {
  const token = this.getToken();
  if (!token) {
    return of(false);
  }

  return this.getCurrentUser().pipe(
    map(user => {
      if (user) {
        this.currentUserSubject.next(user);
        return true;
      }
      return false;
    }),
    catchError(error => {
      this.logout();
      return of(false);
    })
  );
  }
}