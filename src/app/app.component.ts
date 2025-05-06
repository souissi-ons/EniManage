import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gestion_events';
  showMobileSidebar = false;
  currentPage = '';
  userName = '';
  userRole = '';
  userInitials = '';

  constructor(private router: Router, private authService: AuthService) {
    // Track route changes to update page title
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setCurrentPage();
    });
    
    // Set user info on init
    this.setUserInfo();
  }

  isLoginPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login');
  }

  toggleMobileSidebar(): void {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  private setCurrentPage(): void {
    const url = this.router.url;
    // Extract page name from URL
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    
    if (lastSegment) {
      // Convert kebab-case to Title Case (e.g., user-management -> User Management)
      this.currentPage = lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      this.currentPage = 'Dashboard';
    }
  }

  private setUserInfo(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name || 'User';
        this.userRole = user.role || 'User';
  
        // Create initials from name (e.g., John Doe -> JD)
        this.userInitials = user.name
          ? user.name
              .split(' ')
              .map((n:string) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()
          : 'U';
      }
    });
  }
  
}