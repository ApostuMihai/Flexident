import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-programari-dialog',
  templateUrl: './programari-dialog.component.html',
  styleUrls: ['./programari-dialog.component.css'],
  standalone: true,
  imports: [MatButtonModule,
            MatDialogModule,
            


  ],
 
})

export class ProgramariDialogComponent {
  constructor(public dialogRef: MatDialogRef<ProgramariDialogComponent>,
  ) {
   

  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Close the dialog and return true
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
