import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-programari-delete-dialog',
  templateUrl: './programari-delete-dialog.component.html',
  styleUrls: ['./programari-delete-dialog.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ]
})
export class ProgramariDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<ProgramariDeleteDialogComponent>) {}

  onDelete(): void {
    this.dialogRef.close(true);  // User confirmed the deletion
  }

  onCancel(): void {
    this.dialogRef.close(false); // User canceled the deletion
  }
}
