import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gestion_events';
  constructor(private router: Router) {}

  isLoginPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login');
  }
}
