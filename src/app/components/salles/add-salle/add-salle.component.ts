import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';
import { SalleService } from 'src/app/services/salle.service';

@Component({
  selector: 'app-add-salle',
  templateUrl: './add-salle.component.html',
  styleUrls: ['./add-salle.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddSalleComponent implements OnInit {
  addSalleForm: FormGroup;
  resources: Resource[] = [];

  constructor(
    private fb: FormBuilder,
    private salleService: SalleService,
    private resourceService: ResourceService
  ) {
    this.addSalleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      capacity: ['', Validators.required],
      batiment: ['Principal', Validators.required],
      ressources: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe(
      (data) => {
        this.resources = data;
      },
      (error) => {
        console.error('Error loading resources:', error);
      }
    );
  }

  getResourceById(id: number): Observable<any> {
    return this.resourceService.getResourceById(id).pipe(
      catchError((error) => {
        console.error('Error loading resource:', error);
        return of(null);
      })
    );
  }

  get resourcesArray(): FormArray {
    return this.addSalleForm.get('ressources') as FormArray;
  }

  addResource(): void {
    const resourceGroup = this.fb.group({
      resourceName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
    this.resourcesArray.push(resourceGroup);
  }

  removeResource(index: number): void {
    this.resourcesArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.addSalleForm.valid) {
      const formValue = this.addSalleForm.value;

      const resourceRequests = formValue.ressources.map((res: any) =>
        this.getResourceById(Number(res.resourceName)).pipe(
          map((resourceData) => ({
            quantity: res.quantity,
            resource: resourceData,
          }))
        )
      );
      if (resourceRequests && resourceRequests.length > 0) {
        forkJoin(resourceRequests).subscribe({
          next: (ressources) => {
            const salleData = {
              name: formValue.name,
              description: formValue.description,
              capacity: formValue.capacity,
              batiment: formValue.batiment,
              ressources: ressources,
            };

            this.salleService.addSalle(salleData).subscribe({
              next: (response) => {
                console.log('Salle créée avec succès', response);
                this.addSalleForm.reset();
                this.resourcesArray.clear();
              },
              error: (err) => {
                console.error('Erreur lors de la création de la salle', err);
              },
            });
          },
          error: (err) => {
            console.error('Erreur lors du chargement des ressources', err);
          },
        });
      } else {
        const salleData = {
          name: formValue.name,
          description: formValue.description,
          capacity: formValue.capacity,
          batiment: formValue.batiment,
          ressources: [],
        };
        this.salleService.addSalle(salleData).subscribe({
          next: (response) => {
            console.log('Salle créée avec succès', response);
            this.addSalleForm.reset();
            this.resourcesArray.clear();
          },
          error: (err) => {
            console.error('Erreur lors de la création de la salle', err);
          },
        });
      }
    }
  }
}
