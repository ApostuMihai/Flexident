import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PersonalService, User, PaginatedUsersResponse } from '../personal.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivateUserDialogComponent } from '../activate-user-dialog/activate-user-dialog.component';
import { ConfirmActivateAllDialogComponent } from '../confirm-activate-all-dialog/confirm-activate-all-dialog.component';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule, // For HTTP requests
    CommonModule,
    MatTooltipModule, // Common Angular directives,
    MatSnackBarModule
  ]
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['email', 'username', 'name', 'userRole', 'actiuni'];
  dataSource = new MatTableDataSource<User>(); // Use MatTableDataSource for the table
  totalUsers = 0; // Total number of users (for pagination)
  pageSize = 10; // Default page size
  currentPage = 1; // Current page
  users: any[] = []; // Declare the users array

  constructor(private personalService: PersonalService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const pageNumber = 1;
    const pageSize = 10;
  
    this.personalService.getUsers(pageNumber, pageSize).subscribe((response: PaginatedUsersResponse) => {
      // Filter only users with 'contActiv' set to false
      const inactiveUsers = response.users.filter((user: User) => !user.contActiv);
  
      // Use only the filtered users for your table
      this.dataSource.data = inactiveUsers;
    });
  }
  activateUser(user: User): void {
    const dialogRef = this.dialog.open(ActivateUserDialogComponent, {
      width: '400px',
      data: { username: user.username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If confirmed, send the PATCH request to activate the user
        this.personalService.activateUser(user.userId).subscribe(() => {
          this.snackBar.open('User activat cu succes!', 'Închide', { duration: 3000 });

          this.loadUsers();
        });
      }
    });
  }
  // Load users with pagination
  loadUsers(): void {
    this.personalService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedUsersResponse) => {
        // Filter the users where contActiv is false
        const inactiveUsers = response.users.filter(user => !user.contActiv);
        
        // Update the dataSource and totalUsers count based on filtered results
        this.dataSource.data = inactiveUsers;
        this.totalUsers = inactiveUsers.length;
        // Update total number of inactive users
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }
  

  // Pagination logic
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadUsers();
  }
  
  openResetPasswordDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Show success or refresh users list if needed
      }
    });
  }
  
  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '400px',
      data: { username: user.username }  // Pass the username to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Proceed with deletion
        this.deleteUser(user.userId);  // Call the deleteUser method to delete the selected user
      }
    });
  }
  

  deleteUser(userId: number): void {
    this.personalService.deleteUser(userId).subscribe({
      next: () => {
        this.snackBar.open('User șters cu succes!', 'Închide', { duration: 3000 });
        this.loadUsers();  // Reload the list after deletion
      },
      error: (error) => {
        console.error('Eroare la ștergerea userului:', error);
        this.snackBar.open('Eroare la ștergerea userului', 'Închide', { duration: 3000 });
      }
    });
  }
  

  activateAllUsers(): void {
    const dialogRef = this.dialog.open(ConfirmActivateAllDialogComponent, {
      width: '400px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Loop through the displayed users (filtered inactive ones)
        const usersToActivate = this.dataSource.data;
  
        usersToActivate.forEach(user => {
          // Call the patch method for each user to activate them
          this.personalService.updateUser(user.userId, { contActiv: true }).subscribe(
            () => {
              console.log(`User ${user.username} activated successfully.`);
              user.contActiv = true; // Update local user object
            },
            error => {
              console.error(`Error activating user ${user.username}:`, error);
            }
          );
        });
        this.snackBar.open('Userii au fost activați', 'Închide', { duration: 3000 });
  
        // Refresh the entire page
        window.location.reload();
      }
    });
  }
  
}
