import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Pacient, PacientService } from '../pacient.service';
@Component({
  selector: 'app-pacient-dialog',
  templateUrl: './pacient-dialog.component.html',
  styleUrls: ['./pacient-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
   MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,

  ]
})
export class PacientDialogComponent {
  pacientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PacientDialogComponent>,
    private pacientService: PacientService
  ) {
    this.pacientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.pacientForm.valid) {
      const newPacient: Pacient = this.pacientForm.value;

      // Send POST request to the backend
      this.pacientService.addPacient(newPacient).subscribe({
        next: (response) => {
          console.log('Pacient added successfully', response);
          this.dialogRef.close(response); // Close the dialog and pass the new patient data back
        },
        error: (error) => {
          console.error('Error adding pacient', error);
        }
      });
    }
  }
}
