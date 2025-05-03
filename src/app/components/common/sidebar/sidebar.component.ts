import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout() {
  this.authService.logout();
  }
}
