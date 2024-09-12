import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 
import { MatButtonModule } from '@angular/material/button'; // for future buttons
import { PersonalService } from '../personal.service';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';  // Import MatDialog
import { UserResetPasswordDialogComponent } from '../user-reset-password-dialog/user-reset-password-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;  // This will hold the logged-in user data

  constructor(private personalService: PersonalService,    public dialog: MatDialog, public snackBar: MatSnackBar// Inject MatDialog here
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.personalService.getCurrentUser().subscribe({
      next: (user) => {
        console.log(user); // Log the user data
        this.user = user;
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    });
  }
  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: {
        userId: this.user.userId,  // Should be coming from the JWT in your case
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phone: this.user.phone,
        description: this.user.description,
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the local user data with the updated info
        this.user.firstName = result.firstName;
        this.user.lastName = result.lastName;
        this.user.phone = result.phone;
        this.user.description = result.description;
      }
    });
  }
  openResetPasswordDialog(): void {
    const dialogRef = this.dialog.open(UserResetPasswordDialogComponent, {
      width: '400px',
      data: {
        userId: this.user.userId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Parola a fost schimbată cu succes', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  getUserRole(role: number): string {
    switch (role) {
      case 3:
        return 'Admin';
      case 2:
        return 'Asistent';
      case 1:
        return 'Doctor';
      default:
        return 'Unknown';
    }
  }
  
}
