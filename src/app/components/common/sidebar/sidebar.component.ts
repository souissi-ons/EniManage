import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterLink,CommonModule],
})
export class SidebarComponent {
  role: string | null = null;
  menuItems: { label: string; route: string; icon: string }[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.role = user?.role;
      this.setMenuItems();
    });
  }

  setMenuItems() {
    if (this.role === 'ADMIN') {
      this.menuItems = [
        { label: 'Profile', route: '/profile', icon: 'fas fa-user' },
        { label: 'User Management', route: '/users', icon: 'fas fa-users-cog' },
        { label: 'Resource Management', route: '/resources', icon: 'fas fa-toolbox' },
        { label: 'Room Management', route: '/rooms', icon: 'fas fa-door-closed' },
        { label: 'Event Management', route: '/admin-event', icon: 'fas fa-calendar' },
      ];
    } else if (this.role === 'CLUB') {
      this.menuItems = [
        { label: 'Profile', route: '/profile', icon: 'fas fa-user' },
        { label: 'Club Events', route: '/club-events', icon: 'fas fa-calendar-alt' },
        { label: 'Member Management', route: '/membership', icon: 'fas fa-users' },
        { label: 'Chat Channel', route: '/chat', icon: 'fas fa-comments' },
      ];
    } else if (this.role === 'STUDENT') {
      this.menuItems = [
        { label: 'Profile', route: '/profile', icon: 'fas fa-user' },
        { label: 'Events', route: '/events', icon: 'fas fa-calendar-check' },
        { label: 'Chat Channel', route: '/chat', icon: 'fas fa-comments' },
      ];
    }
  }

  logout() {
    this.authService.logout();
  }
}
