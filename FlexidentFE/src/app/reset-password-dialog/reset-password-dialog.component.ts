import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PersonalService } from '../personal.service'; // Make sure you have this service
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-reset-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Needed for handling reactive forms
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password-dialog.component.html',
})
export class ResetPasswordDialogComponent implements OnInit {
  users: any[] = [];
  filteredUsers!: Observable<any[]>; // Observable for filtering users
  resetPasswordForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private fb: FormBuilder,  // Use FormBuilder for creating the form
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.resetPasswordForm = this.fb.group({
      selectedUser: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Fetch users and initialize the filter logic
    this.personalService.getUsers(1, 100).subscribe((response) => {
      this.users = response.users;

      // Initialize filtering logic for the users input
      this.filteredUsers = this.resetPasswordForm.get('selectedUser')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUsers(value))
      );
    });
  }

  // Method to filter users based on the input value
  private _filterUsers(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.users.filter(user =>
      user.username.toLowerCase().includes(filterValue) || 
      user.email.toLowerCase().includes(filterValue)
    );
  }

  // Method to check if Save button can be enabled
  canSave(): boolean {
    const formValues = this.resetPasswordForm.value;
    return (
      this.resetPasswordForm.valid &&
      formValues.newPassword === formValues.confirmPassword  // Ensure both passwords match
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.canSave()) {
      const formValues = this.resetPasswordForm.value;
      const resetData = { newPassword: formValues.newPassword };
  
      this.personalService.resetPassword(formValues.selectedUser.userId, resetData.newPassword).subscribe({
        next: () => {
          this.dialogRef.close(true);
          // Show the success alert after closing the dialog
          this.snackBar.open('Parola a fost schimbată cu succes', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Eroare la schimbarea parolei', 'Close', { duration: 3000 });
        }
      });
    }
  }
  
  
}
