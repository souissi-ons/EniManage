import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gestion_events';

   constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Vérification à chaque initialisation du composant racine
    this.authService.validateToken().subscribe();
  }

  isLoginPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/login');
  }
}
