import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

 canActivate(): Observable<boolean> {
  return this.authService.validateToken().pipe(
    catchError(() => {
      this.router.navigate(['/login']);
      return of(false);
    })
  );
}
}