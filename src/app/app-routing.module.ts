import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { EventsComponent } from './components/events/events/events.component';
import { ResourcesComponent } from './components/resources/resources/resources.component';
import { SallesComponent } from './components/salles/salles/salles.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'users', pathMatch: 'full', component: UsersComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'events', pathMatch: 'full', component: EventsComponent },
  { path: 'resources', pathMatch: 'full', component: ResourcesComponent },
  { path: 'rooms', pathMatch: 'full', component: SallesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
