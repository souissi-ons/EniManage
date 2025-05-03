import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Simplification du démarrage de l'application
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
