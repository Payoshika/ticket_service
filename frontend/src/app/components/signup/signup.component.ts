import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.signUp(this.name, this.email, this.password).
        subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.router.navigate(['/signin']);
          },
          error: (error) => {
            console.error('Error registering user:', error);
            this.errorMessage = 'Registration failed. Please try again.';
          }
        });
    }
  }
}
