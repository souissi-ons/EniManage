import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FeedbackComponent implements OnInit {
  @Input() eventId!: number;
  @Output() feedbackSubmitted = new EventEmitter<void>();
  private currentUserId: number | null = null;

  feedbackForm: FormGroup;
  ratings = [
    {
      control: 'pertinenceEtudes',
      question: 'How relevant was this event to your academic studies?',
      hint: '1 = Not relevant at all, 5 = Extremely relevant',
    },
    {
      control: 'qualiteOrganisation',
      question: 'How well was the event organized?',
      hint: '1 = Poorly organized, 5 = Excellently organized',
    },
    {
      control: 'noteAmbiance',
      question:
        'How would you rate the atmosphere and engagement during the event?',
      hint: '1 = Unpleasant, 5 = Very enjoyable',
    },
  ];

  getRatingText(value: number): string {
    const ratings = ['Very poor', 'Poor', 'Average', 'Good', 'Excellent'];
    return ratings[value - 1] || '';
  }

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      noteGlobale: [
        0,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      pertinenceEtudes: [
        0,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      qualiteOrganisation: [
        0,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      noteAmbiance: [
        0,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      recommandation: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  setRating(controlName: string, value: number): void {
    this.feedbackForm.get(controlName)?.setValue(value);
  }

  loadCurrentUser() {
    this.authService.currentUser$.subscribe((user: Users | null) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
  }

  onSubmit(): void {
    console.log('Current token:', this.authService.getToken());
    console.log('Feedback data:', this.feedbackForm.value);

    if (this.feedbackForm.valid) {
      // Récupérez l'ID utilisateur directement depuis le BehaviorSubject

      if (!this.currentUserId) {
        console.error('No user ID available');
        return;
      }

      // Préparez les données avec le bon format
      const feedbackData = {
        eventId: this.eventId,
        userId: this.currentUserId, // Utilisez l'ID numérique directement
        noteGlobale: this.feedbackForm.value.noteGlobale,
        pertinenceEtudes: this.feedbackForm.value.pertinenceEtudes,
        qualiteOrganisation: this.feedbackForm.value.qualiteOrganisation,
        noteAmbiance: this.feedbackForm.value.noteAmbiance,
        recommandation: this.feedbackForm.value.recommandation,
      };

      console.log('Sending feedback data:', feedbackData);

      this.eventsService.addFeedback(feedbackData).subscribe({
        next: () => {
          this.feedbackSubmitted.emit();
          this.feedbackForm.reset();
        },
        error: (err) => {
          console.error('Error submitting feedback:', err);
          // Affichez plus de détails sur l'erreur
          if (err.error) {
            console.error('Server error details:', err.error);
          }
        },
      });
    }
  }
}
