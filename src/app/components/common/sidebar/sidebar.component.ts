import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class SidebarComponent {
  constructor(private router: Router) {}
  logout() {
    this.router.navigate(['/login']);
  }
}
