import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { EventsClubComponent } from './components/events/Events-Club/events-club.component';
import { ResourcesComponent } from './components/resources/resources/resources.component';
import { SallesComponent } from './components/salles/salles/salles.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminEventManagementComponent } from './components/events/admin-event-management/admin-event-management.component';
import { AdminEventCardComponent } from './components/events/admin-event-card/admin-event-card.component';
import { ChatComponent } from './components/chat/chat/chat.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { ClubMembersComponent } from './components/users/club-members/club-members.component';
import { RoleGuard } from './guards/role.guard';
import { EventsComponent } from './components/events/events/events.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'resources',
        component: ResourcesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'rooms',
        component: SallesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'admin-event',
        component: AdminEventManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'admin-card',
        component: AdminEventCardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'club-events',
        component: EventsClubComponent,
        canActivate: [RoleGuard],
        data: { roles: ['CLUB'] }
      },
      {
        path: 'membership',
        component: ClubMembersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['CLUB'] }
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['STUDENT'] }
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [RoleGuard],
        data: { roles: ['CLUB', 'STUDENT'] }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'CLUB', 'STUDENT'] }
      },
      { path: '', redirectTo: '/profile', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
