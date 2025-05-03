import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { inject } from '@angular/core';
import { AuthService } from './app/services/auth.service';




  platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
  // Vérification finale après bootstrap
  const auth = inject(AuthService);
  auth.validateToken().subscribe();
});