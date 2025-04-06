import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddUserComponent {
  constructor(private usersService: UsersService, private http: HttpClient) {}

  private formBuilder = inject(FormBuilder);
  logoPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  addUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    birthDate: ['', Validators.required],
    role: ['', Validators.required],
    description: [''],
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      const formValue = this.addUserForm.value;
      const formData = new FormData();

      const userData = {
        name: formValue.name,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        birthDate: formValue.birthDate,
        role: formValue.role,
        description: formValue.description || null,
      };

      formData.append(
        'user',
        new Blob([JSON.stringify(userData)], {
          type: 'application/json',
        })
      );

      if (this.selectedFile) {
        formData.append('logo', this.selectedFile, this.selectedFile.name);
      }

      this.usersService.addUser(formData).subscribe({
        next: (response) => {
          console.log('Ajout réussi', response);
          this.addUserForm.reset();
          this.logoPreview = null;
          this.selectedFile = null;
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout", error);
        },
      });
    } else {
      this.addUserForm.markAllAsTouched();
    }
  }
}
