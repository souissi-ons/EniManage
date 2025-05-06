import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';
import { Injectable } from '@angular/core';

// no-auth.guard.ts
@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (!user) {
          return true;
        } else {
          this.router.navigate(['/profile']);
          return false;
        }
      }),
      take(1)
    );
  }
}
