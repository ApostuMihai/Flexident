import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-activate-all-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule

  ],
  templateUrl: './confirm-activate-all-dialog.component.html',
  styleUrl: './confirm-activate-all-dialog.component.css'
})
export class ConfirmActivateAllDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmActivateAllDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false); // Cancelled
  }

  onSave(): void {
    this.dialogRef.close(true); // Confirmed
  }
}
