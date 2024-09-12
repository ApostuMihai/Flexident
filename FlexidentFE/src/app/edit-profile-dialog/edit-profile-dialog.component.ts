import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalService } from '../personal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule
  ]
})
export class EditProfileDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any,
    private personalService: PersonalService
  ) {
    // Initialize form with existing user data
    this.editForm = this.fb.group({
      firstName: [this.userData.firstName, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      phone: [this.userData.phone, Validators.required],
      description: [this.userData.description, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without making changes
  }

  onSave() {
    const updatedData = this.editForm.value;
  
    this.personalService.updateCurrentUser(updatedData).subscribe({
      next: (updatedUser) => {
        // Update the user information in the local state after successful response
        this.dialogRef.close(updatedUser);
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
  
  
}
