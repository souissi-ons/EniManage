import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../../common/popup/popup.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, PopupComponent],

  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent {}
