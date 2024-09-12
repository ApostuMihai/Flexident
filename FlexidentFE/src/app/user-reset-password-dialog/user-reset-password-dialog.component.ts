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
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-reset-password-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-reset-password-dialog.component.html'
})
export class UserResetPasswordDialogComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private personalService: PersonalService,
    private dialogRef: MatDialogRef<UserResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar // Import the snackbar for notifications
  ) {
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(formGroup: FormGroup): any {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  onSave(): void {
    if (this.resetPasswordForm.valid) {
      const formValues = this.resetPasswordForm.value;
      const resetPasswordDto = {
        currentPassword: formValues.currentPassword,
        newPassword: formValues.newPassword
      };

      // Make the API call to reset the password
      this.personalService.resetPasswordUser(this.data.userId, resetPasswordDto).subscribe({
        next: () => {
          this.snackBar.open('Parola schimbata cu succes!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);  // Close the dialog after success
        },
        error: (error) => {
          console.error('Error resetting password', error);
          this.snackBar.open('A apărut o eroare!', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
