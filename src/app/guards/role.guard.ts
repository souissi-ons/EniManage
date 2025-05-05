import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedRoles: string[] = route.data['roles'];

    return this.authService.currentUser$.pipe(
      map(user => {
        const userRole = user?.role;
        if (userRole && expectedRoles.includes(userRole)) {
          return true;
        } else {
          return this.router.parseUrl('/profile');
        }
      })
    );
  }
}
