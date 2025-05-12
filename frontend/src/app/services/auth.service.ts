import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

export interface SignInResponse {
  token: string;
  user: {
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router:Router,    @Inject(PLATFORM_ID) private platformId: Object
) {
  }
  signUp(name: string, email: string, password: string) {
    const body = { name, email, password };
    return this.http.post(`${environment.apiUrl}/users/signup`, body);
  }
  signIn(email: string, password: string) {
    const body = { email, password };
    return this.http.post<SignInResponse>(`${environment.apiUrl}/users/signin`, body);
  }
  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      return !!token;
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/signin']);
  }

  getUserProfile() {
    return this.http.get<{ user: any }>(`${environment.apiUrl}/users/profile`);
  }
  
}
