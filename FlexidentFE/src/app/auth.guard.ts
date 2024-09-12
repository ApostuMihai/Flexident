import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // Make sure this path is correct

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router

  if (authService.isAuthenticated()) {
    return true; // Allow navigation if authenticated
  } else {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false; // Prevent navigation
  }
};
