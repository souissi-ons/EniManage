import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Salle } from 'src/app/models/salle';
import { SalleService } from 'src/app/services/salle.service';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';
import { ResourceSalle } from 'src/app/models/salle';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
@Component({
  selector: 'app-edit-salle',
  templateUrl: './edit-salle.component.html',
  styleUrls: ['./edit-salle.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditSalleComponent implements OnChanges {
  private formBuilder = inject(FormBuilder);
  private salleService = inject(SalleService);
  private resourceService = inject(ResourceService);

  @Input() salleData: Salle | null = null;
  salleId: number = -1;
  successMessage: string = '';
  errorMessage: string = '';
  resources: Resource[] = [];
  isLoading = false;

  editSalleForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    batiment: ['Principal', Validators.required],
    capacity: [
      0,
      [Validators.required, Validators.min(1), Validators.max(500)],
    ],
    ressources: this.formBuilder.array([]),
  });

  get resourcesArray() {
    return this.editSalleForm.get('ressources') as FormArray;
  }

  ngOnChanges(): void {
    if (this.salleData) {
      this.loadSalleData(this.salleData);
    }
  }

  private loadSalleData(salle: Salle): void {
    this.isLoading = true;
    this.salleId = salle.id!;

    this.editSalleForm.patchValue({
      name: salle.name,
      description: salle.description,
      batiment: salle.batiment,
      capacity: salle.capacity,
    });

    this.resourceService.getResources().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.prepareResourcesFormArray(salle.ressources || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load resources', error);
        this.isLoading = false;
      },
    });
  }

  private prepareResourcesFormArray(resources: ResourceSalle[]): void {
    this.resourcesArray.clear();

    resources.forEach((resourceSalle) => {
      this.addResource(resourceSalle);
    });
  }

  createResourceFormGroup(resourceSalle?: ResourceSalle): FormGroup {
    return this.formBuilder.group({
      resourceId: [resourceSalle?.resource?.id || null, Validators.required],
      quantity: [
        resourceSalle?.quantity || 1,
        [Validators.required, Validators.min(1)],
      ],
      resourceSalleId: [resourceSalle?.id || null],
    });
  }

  addResource(resourceSalle?: ResourceSalle): void {
    this.resourcesArray.push(this.createResourceFormGroup(resourceSalle));
  }

  removeResource(index: number): void {
    this.resourcesArray.removeAt(index);
  }

  getResourceById(id: number): Observable<any> {
    return this.resourceService.getResourceById(id).pipe(
      catchError((error) => {
        console.error('Error loading resource:', error);
        return of(null);
      })
    );
  }

  onSubmit(): void {
    if (this.editSalleForm.invalid) {
      this.editSalleForm.markAllAsTouched();
      return;
    }

    const formValue = this.editSalleForm.value;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const resourceRequests = formValue.ressources?.map((res: any) =>
      this.getResourceById(Number(res.resourceId)).pipe(
        map((resourceData) => ({
          quantity: res.quantity,
          resource: resourceData,
        }))
      )
    );
    if (resourceRequests && resourceRequests.length > 0) {
      forkJoin(resourceRequests).subscribe({
        next: (resources) => {
          const updatedSalle = {
            name: formValue.name,
            description: formValue.description,
            capacity: formValue.capacity,
            batiment: formValue.batiment,
            ressources: resources,
          };
          if (this.salleData?.id) {
            this.salleService
              .updateSalle(this.salleData?.id, updatedSalle)
              .subscribe({
                next: (response) => {
                  this.successMessage = 'Room updated successfully';
                  this.errorMessage = '';
                  this.isLoading = false;
                },
                error: (error) => {
                  this.successMessage = '';
                  this.errorMessage = 'Error updating room';
                  console.error('Update error:', error);
                  this.isLoading = false;
                },
              });
          }
        },
        error: (err) => {
          console.error('Erreur lors du chargement des ressources', err);
        },
      });
    } else {
      const updatedSalle = {
        name: formValue.name,
        description: formValue.description,
        capacity: formValue.capacity,
        batiment: formValue.batiment,
        ressources: [],
      };
      if (this.salleData?.id) {
        this.salleService
          .updateSalle(this.salleData?.id, updatedSalle)
          .subscribe({
            next: (response) => {
              this.successMessage = 'Room updated successfully';
              this.errorMessage = '';
              this.isLoading = false;

              setTimeout(() => {
                this.successMessage = '';
              }, 5000);
            },
            error: (error) => {
              this.successMessage = '';
              this.errorMessage = 'Error updating room';
              console.error('Update error:', error);
              this.isLoading = false;

              setTimeout(() => {
                this.errorMessage = '';
              }, 5000);
            },
          });
      }
    }
  }
}
