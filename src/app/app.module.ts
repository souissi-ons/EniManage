import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users/users.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { PopupComponent } from './components/common/popup/popup.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { ConfirmationDialogComponent } from './components/common/confirmation-dialog/confirmation-dialog.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EventCardComponent } from './components/events/event-card/event-card.component';
import { EventsComponent } from './components/events/events/events.component';
import { UpdateUserComponent } from './components/users/update-user/update-user.component';
import { ResourcesComponent } from './components/resources/resources/resources.component';
import { AddResourceComponent } from './components/resources/add-resource/add-resource.component';
import { EditResourceComponent } from './components/resources/edit-resource/edit-resource.component';
import { SallesComponent } from './components/salles/salles/salles.component';
import { AddSalleComponent } from './components/salles/add-salle/add-salle.component';
import { EditSalleComponent } from './components/salles/edit-salle/edit-salle.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './services/auth.service';

export function initializeAuth(authService: AuthService) {
  return () => authService.validateToken().toPromise();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoginComponent,
    UsersComponent,
    SidebarComponent,
    PopupComponent,
    AddUserComponent,
    UpdateUserComponent,
    ConfirmationDialogComponent,
    EventCardComponent,
    EventsComponent,
    ResourcesComponent,
    AddResourceComponent,
    EditResourceComponent,
    SallesComponent,
    AddSalleComponent,
    EditSalleComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
   
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
