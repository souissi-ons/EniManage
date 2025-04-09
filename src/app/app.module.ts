import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/User/users/users.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { PopupComponent } from './components/common/popup/popup.component';
import { AddUserComponent } from './components/User/add-user/add-user.component';
import { UpdateUserComponent } from './components/User/update-user/update-user.component';
import { ConfirmationDialogComponent } from './components/common/confirmation-dialog/confirmation-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventsComponent } from './components/events/events.component';

@NgModule({
  declarations: [AppComponent, EventCardComponent, EventsComponent],
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
