import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResourceService } from 'src/app/services/resource.service';
import { Resource } from 'src/app/models/resource';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddResourceComponent {
  private formBuilder = inject(FormBuilder);

  constructor(private resourceService: ResourceService) {}

  addResourceForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
  });

  onSubmit() {
    if (this.addResourceForm.valid) {
      const formValue = this.addResourceForm.value;

      const resourceData: Resource = {
        name: formValue.name!,
        description: formValue.description!,
        quantity: Number(formValue.quantity),
      };

      this.resourceService.addResource(resourceData).subscribe({
        next: (response) => {
          console.log('Ajout réussi :', response);
          this.addResourceForm.reset();
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout :", error);
        },
      });
    } else {
      this.addResourceForm.markAllAsTouched();
    }
  }
}
