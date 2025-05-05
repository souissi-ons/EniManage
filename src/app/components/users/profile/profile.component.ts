import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  user: Users | null = null;
  isLoading = true;
  isPasswordLoading = false;
  profileSuccess = false;
  profileError: string | null = null;
  passwordSuccess = false;
  passwordError: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    // Initialize forms
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{8}$')],
      ],
      birthDate: ['', Validators.required],
      description: [''],
    });

    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;
    this.authService.currentUser$.subscribe({
      next: (userData) => {
        if (userData && userData.id) {
          this.usersService.getUserById(userData.id).subscribe({
            next: (user) => {
              this.user = user;
              this.populateForm(user);

              // Handle profile image only for CLUB role
              if (user.role === 'CLUB' && user.logo) {
                this.imagePreview = this.usersService.getUserImageUrl(
                  user.logo
                );
              }

              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error fetching user data:', error);
              this.profileError = 'Error loading user data';
              this.isLoading = false;
            },
          });
        } else {
          this.authService.fetchCurrentUser().subscribe({
            next: (userData) => {
              if (userData && userData.id) {
                this.usersService.getUserById(userData.id).subscribe({
                  next: (user) => {
                    this.user = user;
                    this.populateForm(user);

                    // Handle profile image only for CLUB role
                    if (user.role === 'CLUB' && user.logo) {
                      this.imagePreview = this.usersService.getUserImageUrl(
                        user.logo
                      );
                    }

                    this.isLoading = false;
                  },
                  error: (error) => {
                    console.error('Error fetching user data:', error);
                    this.profileError = 'Error loading user data';
                    this.isLoading = false;
                  },
                });
              } else {
                this.isLoading = false;
                this.profileError = 'No user data available';
              }
            },
            error: (error) => {
              console.error('Error fetching current user:', error);
              this.isLoading = false;
              this.profileError = 'Error loading user data';
            },
          });
        }
      },
      error: (error) => {
        console.error('Error with user subscription:', error);
        this.isLoading = false;
        this.profileError = 'Error loading user data';
      },
    });
  }

  populateForm(user: Users) {
    this.profileForm.patchValue({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      birthDate: this.formatDateForInput(user.birthDate),
      description: user.description || '',
    });
  }

  private formatDateForInput(date: Date | string): string {
    return formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.user?.role === 'CLUB') {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProfile() {
    if (this.profileForm.valid && this.user) {
      this.isLoading = true;
      this.profileSuccess = false;
      this.profileError = null;

      const formValue = this.profileForm.value;
      const formData = new FormData();

      const userData = {
        name: formValue.name,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        birthDate: formValue.birthDate,
        role: this.user.role,
        description:
          this.user.role === 'CLUB' ? formValue.description || null : null,
      };

      formData.append(
        'user',
        new Blob([JSON.stringify(userData)], {
          type: 'application/json',
        })
      );

      if (this.user.role === 'CLUB' && this.selectedFile) {
        formData.append('logo', this.selectedFile, this.selectedFile.name);
      }

      console.log('Updating profile with data:', formData);
      console.log('Current token:', localStorage.getItem('token'));

      this.usersService.updateUser(this.user.id, formData).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.user = response;

          if (
            this.user?.role === 'CLUB' &&
            this.selectedFile &&
            response.logo
          ) {
            this.imagePreview = this.usersService.getUserImageUrl(
              response.logo
            );
          }

          this.profileSuccess = true;
          this.isLoading = false;

          this.authService.fetchCurrentUser().subscribe();

          setTimeout(() => {
            this.profileSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.profileError = 'Error updating profile';
          this.isLoading = false;
          setTimeout(() => {
            this.profileError = null;
          }, 5000);
        },
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid && this.user) {
      this.isPasswordLoading = true;
      this.passwordSuccess = false;
      this.passwordError = null;

      const { currentPassword, newPassword } = this.passwordForm.value;

      this.usersService
        .updateUserPassword(this.user.id, currentPassword, newPassword)
        .subscribe({
          next: () => {
            this.passwordSuccess = true;
            this.isPasswordLoading = false;
            this.passwordForm.reset();

            setTimeout(() => {
              this.passwordSuccess = false;
            }, 5000);
          },
          error: (error) => {
            console.error('Password update error:', error);
            this.passwordError =
              error.error?.message || 'Error updating password';
            this.isPasswordLoading = false;

            setTimeout(() => {
              this.passwordError = null;
            }, 5000);
          },
        });
    }
  }

  checkPasswords(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
