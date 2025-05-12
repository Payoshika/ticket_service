import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userData: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  } | null = null;
  errorMessage: string = '';
  constructor(private authService:AuthService, private http:HttpClient) {}

  ngOnInit(): void {
    this.http.get(environment.apiUrl+'/users/profile').subscribe({
      next: (response: any) => {
        const user = response.user;
        this.userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        };
      }
      , error: (error) => {
        console.error('Error fetching user data:', error);
        this.errorMessage = 'Failed to fetch user data. Please try again later.';
      }
    });
  }
  onLogout() {
    this.authService.logout();
  }
}
