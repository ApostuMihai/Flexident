import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Decode the token manually without using external libraries
  decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1]; // Get the payload part of the token
      const decodedPayload = atob(payloadBase64); // Decode base64
      return JSON.parse(decodedPayload); // Parse the JSON
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token); // Store token in local storage
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken.userRole) {
        localStorage.setItem('userRole', decodedToken.userRole); // Store userRole in local storage
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole'); // Clear user role on logout
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken'); // Check if token exists
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken'); // Get token from local storage
    }
    return null;
  }

  getUserRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userRole'); // Get userRole from local storage
    }
    return null;
  }
}
