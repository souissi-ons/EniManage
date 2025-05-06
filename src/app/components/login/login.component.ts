import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.router.navigate(['/profile']);
      }
    });
  }

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage: string = '';

  // login.component.ts
  isLoading = false;

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => (this.isLoading = false),
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password';
        },
      });
    }
  }
}
