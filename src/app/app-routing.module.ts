import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { EventsComponent } from './components/events/events/events.component';
import { ResourcesComponent } from './components/resources/resources/resources.component';
import { SallesComponent } from './components/salles/salles/salles.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
    { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'rooms', component: SallesComponent },
  { path: 'events', component: EventsComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: '**', redirectTo: '/events' }
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: 'users', component: UsersComponent },
  //     { path: 'resources', component: ResourcesComponent },
  //     { path: 'salles', component: SallesComponent },
  //     { path: 'events', component: EventsComponent },
  //     { path: '', redirectTo: '/events', pathMatch: 'full' }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
