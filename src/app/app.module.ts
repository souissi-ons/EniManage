import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventsComponent } from './components/events/events.component';

@NgModule({
  declarations: [AppComponent, EventCardComponent, EventsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginComponent,
    UsersComponent,
    SidebarComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
