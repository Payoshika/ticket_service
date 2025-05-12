import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, SignInResponse } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})

export class SigninComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private authService: AuthService, private router:Router) { }
  
  
  onSubmit(form:NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.authService.signIn(this.email, this.password).subscribe({
      next: (response: SignInResponse) => {
      const token = response.token;
      localStorage.setItem('token', token);
      console.log('User signed in successfully:', response);
      this.successMessage = 'Login successful!';
      this.errorMessage = ''; // Clear any previous error message
      this.router.navigate(['/tickets']);
      },
      error: (error) => {
      console.error('Error signing in user:', error);
      this.errorMessage = 'Invalid email or password.';
      this.successMessage = ''; // Clear any previous success message
      }
    });
  }
}
