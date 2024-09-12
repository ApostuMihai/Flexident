import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-activate-user-dialog',
  templateUrl: './activate-user-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule]
})
export class ActivateUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ActivateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
