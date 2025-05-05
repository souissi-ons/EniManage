import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SalleService } from '../../../services/salle.service';
import { Salle } from '../../../models/salle';
import { AuthService } from '../../../services/auth.service';
import { Users } from '../../../models/users';
import { EventsService } from '../../../services/events.service';
import { ResourceService } from '../../../services/resource.service';
import { Resource } from '../../../models/resource';
import { EventResource } from '../../../models/event';

@Component({
  selector: 'app-request-event',
  templateUrl: './request-event.component.html',
  styleUrls: ['./request-event.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RequestEventComponent implements OnInit {
  @Output() eventRequested = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  salles: Salle[] = [];
  availableResources: Resource[] = [];
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private salleService: SalleService,
    private authService: AuthService,
    private resourceService: ResourceService
  ) {}

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', [Validators.required, Validators.minLength(1)]],
    dateStart: ['', Validators.required],
    dateEnd: ['', Validators.required],
    isPrivate: [false],
    capacity: [null, [Validators.required, Validators.min(1)]],
    salleId: [null, Validators.required],
    resources: this.fb.array([])
  }, {
    validators: [this.dateRangeValidator]
  });

  get resourcesFormArray() {
    return this.eventForm.get('resources') as FormArray;
  }

  ngOnInit() {
    this.loadSalles();
    this.loadResources();
    this.loadCurrentUser();

    // Re-run validation when start or end date changes
    this.eventForm.get('dateStart')?.valueChanges.subscribe(() => {
      this.eventForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
    this.eventForm.get('dateEnd')?.valueChanges.subscribe(() => {
      this.eventForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
  }

  loadCurrentUser() {
    this.authService.currentUser$.subscribe((user: Users | null) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
  }

  loadSalles() {
    this.salleService.getAllSalles().subscribe({
      next: (salles) => this.salles = salles,
      error: (err) => console.error('Error loading salles:', err)
    });
  }

  loadResources() {
    this.resourceService.getResources().subscribe({
      next: (resources) => this.availableResources = resources,
      error: (err) => console.error('Error loading resources:', err)
    });
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = new Date(control.get('dateStart')?.value);
    const end = new Date(control.get('dateEnd')?.value);

    if (start && end && start >= end) {
      return { invalidDateRange: true };
    }
    return null;
  }

  addResource() {
    const resourceForm = this.fb.group({
      resourceId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.resourcesFormArray.push(resourceForm);
  }

  removeResource(index: number) {
    this.resourcesFormArray.removeAt(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.eventForm.valid && this.currentUserId) {
      const formData = new FormData();
  
      const resources = this.resourcesFormArray.value.filter(
        (resource: any) => resource.resourceId && resource.quantity > 0
      );
  
      const eventData = {
        ...this.eventForm.value,
        resources: resources,
        creatorId: this.currentUserId,
        dateStart: new Date(this.eventForm.value.dateStart!).toISOString(),
        dateEnd: new Date(this.eventForm.value.dateEnd!).toISOString(),
        status: 'PENDING'
      };
  
      formData.append('eventDTO', new Blob([JSON.stringify(eventData)], {
        type: 'application/json'
      }));
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
  
      this.eventsService.createEvent(formData).subscribe({
        next: () => {
          this.eventRequested.emit();      // Refresh events list (if needed)
  
          
          this.imagePreview = null;
          this.selectedFile = null;
  
          // Optional: Re-initialize checkbox if needed
          this.eventForm.patchValue({ isPrivate: false });

          this.eventForm.reset();          // Reset form controls
          this.resourcesFormArray.clear(); // Clear the FormArray
          this.closeModal.emit();          // Close the popup

        },
        error: (err) => {
          console.error('Error creating event:', err);
        }
      });
    }
  }  
}