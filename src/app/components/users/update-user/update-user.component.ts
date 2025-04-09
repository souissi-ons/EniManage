import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class UpdateUserComponent implements OnChanges {
  private formBuilder = inject(FormBuilder);
  constructor(private usersService: UsersService) {}
  @Input() userData: Users | null = null;
  existingLogoUrl: string | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  newImageSelected = false;
  userId: number = -1;
  successMessage: string = '';
  errorMessage: string = '';

  editUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    birthDate: ['', Validators.required],
    role: ['STUDENT', Validators.required],
    description: [''],
  });

  ngOnChanges() {
    if (this.userData) {
      console.log(this.userData);
      this.userId = this.userData.id;
      if (this.userData.logo) {
        this.existingLogoUrl = this.usersService.getUserImageUrl(
          this.userData.logo
        );
      }

      this.editUserForm.patchValue({
        name: this.userData.name,
        email: this.userData.email,
        phoneNumber: this.userData.phoneNumber,
        birthDate: this.formatDateForInput(this.userData.birthDate),
        role: this.userData.role,
        description: this.userData.description || '',
      });
    }
  }

  private formatDateForInput(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.newImageSelected = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.editUserForm.valid && this.userData) {
      const formValue = this.editUserForm.value;
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

      console.log('Form data:', formData);

      this.usersService.updateUser(this.userId, formData).subscribe({
        next: (response) => {
          if (this.selectedFile && response.logo) {
            this.existingLogoUrl = this.usersService.getUserImageUrl(
              response.logo
            );
          }
          this.successMessage = 'User updated successfully';
        },
        error: (error) => {
          this.errorMessage = 'Error updating user';
        },
      });
    }
  }
}
