import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isPrivate: [false],
      building: ['principal', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      capacity: [null, [Validators.required, Validators.min(1)]],
      material: ['', Validators.required],
      room: ['', Validators.required]
    });
  }

  submitEvent() {
    if (this.eventForm.valid) {
      console.log('Événement soumis :', this.eventForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }
}