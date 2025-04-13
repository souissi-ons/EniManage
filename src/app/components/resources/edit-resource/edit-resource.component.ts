import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditResourceComponent implements OnChanges {
  private formBuilder = inject(FormBuilder);
  constructor(private resourcesService: ResourceService) {}

  @Input() resourceData: Resource | null = null;
  resourceId: number = -1;
  successMessage: string = '';
  errorMessage: string = '';

  editResourceForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges() {
    if (this.resourceData) {
      this.resourceId = this.resourceData.id!;

      this.editResourceForm.patchValue({
        name: this.resourceData.name,
        description: this.resourceData.description || '',
        quantity: this.resourceData.quantity,
      });
    }
  }

  onSubmit() {
    if (this.editResourceForm.valid && this.resourceData) {
      const formValue = this.editResourceForm.value;

      const updatedResource: Resource = {
        id: this.resourceId,
        name: formValue.name!,
        description: formValue.description!,
        quantity: Number(formValue.quantity),
      };

      this.resourcesService.updateResource(updatedResource).subscribe({
        next: (response) => {
          this.successMessage = 'Resource updated successfully';
          this.errorMessage = '';
          console.log('Ressource mise à jour :', response);

          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.errorMessage = 'Error updating resource';
          this.successMessage = '';
          console.error(error);

          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        },
      });
    } else {
      this.editResourceForm.markAllAsTouched();
    }
  }
}
