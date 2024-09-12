import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';  // For the dialog
import { MatButtonModule } from '@angular/material/button';  // For the buttons
import { MatFormFieldModule } from '@angular/material/form-field';  // For the form fields
import { MatInputModule } from '@angular/material/input';  // For input elements like text fields
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-pacient-dialog',
  templateUrl: './edit-pacient-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class EditPacientDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditPacientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Create a form with default values from data
    this.editForm = this.fb.group({
      name: [data.name, Validators.required],
      phone: [data.phone, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      age: [data.age, Validators.required],
    });
  }

  // Called when the user clicks the 'Cancel' button
  onCancel(): void {
    this.dialogRef.close();
  }

  // Called when the user clicks the 'Save' button
  onSubmit(): void {
    if (this.editForm.valid) {
      // Return the form data along with the pacientId
      this.dialogRef.close({ ...this.editForm.value, pacientId: this.data.pacientId });
    }
  }
}
