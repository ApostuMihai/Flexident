import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Adjust the path based on your project structure

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
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
  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.decodeToken(token); // Make sure this method exists in AuthService
      if (decodedToken && decodedToken.userRole === 'Admin') {
        return true; // Allow access if userRole is Admin
      }
    }

    // If not authorized, redirect to the dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
