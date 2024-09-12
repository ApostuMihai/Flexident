import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';  // For the dialog
import { MatButtonModule } from '@angular/material/button';  // For the buttons
import { MatFormFieldModule } from '@angular/material/form-field';  // For the form fields
import { MatInputModule } from '@angular/material/input';  // For input elements like text fields
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-delete-pacient-dialog',
  standalone: true,
  imports: [
   
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule

  ],
  templateUrl: './delete-pacient-dialog.component.html',
  styleUrl: './delete-pacient-dialog.component.css'
})
export class DeletePacientDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeletePacientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Access the data passed (e.g., patient's name)
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);  // Close the dialog without confirming
  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Close the dialog and confirm deletion
  }
}
