import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service'; 
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Adjust this path
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
  
      this.http.post<{ token: string }>('https://localhost:7264/login', credentials).subscribe({
        next: (response) => {
          this.authService.login(response.token);  // Use AuthService to handle login
          this.userService.setUsername(credentials.username); 
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
  
          // Check if the response has a proper JSON error message
          if (error.error && error.error.message) {
            if (error.error.message === "Your account is inactive. Please contact support.") {
              this.router.navigate(['/helpingpage']);  // Redirect to helping page for inactive accounts
            } else {
              this.errorMessage = error.error.message;  // Display the actual error message from the backend
            }
          } else {
            this.errorMessage = 'An unknown error occurred. Please try again.';
          }
        }
      });
    }
  }
  
  
}
