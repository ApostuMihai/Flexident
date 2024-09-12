import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ]
})
export class MainLayoutComponent implements OnInit {
  isAdmin = false; // Variable to track if the user is an admin

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken(); // Get the token from AuthService
    if (token) {
      const decodedToken = this.authService.decodeToken(token); // Pass the token to decodeToken()
      if (decodedToken && decodedToken.userRole === 'Admin') {
        this.isAdmin = true; // Set isAdmin to true if the userRole is 'Admin'
      }
    }
  }

  logout() {
    this.authService.logout(); // Clear the JWT token
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
