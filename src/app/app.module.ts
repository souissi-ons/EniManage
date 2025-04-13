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
import { HttpClientModule } from '@angular/common/http';
import { EventCardComponent } from './components/events/event-card/event-card.component';
import { EventsComponent } from './components/events/events/events.component';
import { UpdateUserComponent } from './components/users/update-user/update-user.component';
import { ResourcesComponent } from './components/resources/resources/resources.component';
import { AddResourceComponent } from './components/resources/add-resource/add-resource.component';
import { EditResourceComponent } from './components/resources/edit-resource/edit-resource.component';
import { SallesComponent } from './components/salles/salles/salles.component';
import { AddSalleComponent } from './components/salles/add-salle/add-salle.component';
import { EditSalleComponent } from './components/salles/edit-salle/edit-salle.component';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
