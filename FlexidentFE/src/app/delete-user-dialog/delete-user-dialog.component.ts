import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string }  // We pass only the username to the dialog
  ) {}

  // Method to handle the cancel action
  onCancel(): void {
    this.dialogRef.close(null);  // Close the dialog without any action
  }

  // Method to handle the delete action
  onDelete(): void {
    this.dialogRef.close(true);  // Confirm the deletion and close the dialog
  }
}
