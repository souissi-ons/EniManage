import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = this.authService.getToken();

    // Si le token existe déjà, autoriser l'accès immédiatement
    // tout en validant le token en arrière-plan
    if (token) {
      // Valider le token mais ne pas bloquer la navigation
      // this.authService.validateToken().subscribe();
      return of(true);
    }

    // Si pas de token, bloquer et rediriger
    this.router.navigate(['/login']);
    return of(false);
  }
}
