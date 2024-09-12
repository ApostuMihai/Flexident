import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgramariService } from '../programari.service'; // Ensure this is your correct service path
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; 
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-programare-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    {provide: DateAdapter, useClass: NativeDateAdapter},
  ],
  templateUrl: './add-programare-dialog.component.html',
  styleUrl: './add-programare-dialog.component.css'
})
export class AddProgramareDialogComponent implements OnInit {
  addForm: FormGroup;
  filteredPacients: Observable<any[]> = of([]);
  filteredUsers: Observable<any[]> = of([]);
  filteredLucrari: Observable<any[]> = of([]);

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,

    public dialogRef: MatDialogRef<AddProgramareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // You can use this if you need data passed to the dialog
    private programariService: ProgramariService
  ) {
    this.dateAdapter.setLocale('en-GB');
    // Initialize the form with empty fields for the new programare
    this.addForm = this.fb.group({
      pacient: [''],
      pacientSearch: [''], // Empty by default
      doctor: [''],
      doctorSearch: [''], // Empty by default
      lucrare: [''],
      lucrareSearch: [''], // Empty by default
      date: [''], // Empty by default
      time: ['']  // Empty by default
    });
  }

  ngOnInit(): void {
    // Pacient filtering logic
    this.filteredPacients = this.addForm.get('pacientSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPacients(value || ''))
    );

    // Doctor filtering logic
    this.filteredUsers = this.addForm.get('doctorSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || ''))
    );

    // Lucrare filtering logic
    this.filteredLucrari = this.addForm.get('lucrareSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLucrari(value || ''))
    );
  }

  // Pacient filtering logic (limit to 10 results like before)
  private _filterPacients(value: string): any[] {
    const filterValue = value.toLowerCase();
  
    // Ensure data.pacienti is an array before filtering
    if (!this.data.pacienti || this.data.pacienti.length === 0) {
      return [];  // Return an empty array if pacienti data is not available
    }
  
    return this.data.pacienti
      .filter((pacient: any) => pacient.name.toLowerCase().includes(filterValue))
      .slice(0, 10);  // Limit to 10 results
  }

  private _filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
  
    // Filter only users with userRole === 1
    const filteredDoctors = this.data.users.filter((user: any) => user.userRole === 1);
  
    if (!filteredDoctors || filteredDoctors.length === 0) {
      return [];  // Return an empty array if no valid users
    }
  
    return filteredDoctors
      .filter((user: any) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterValue))
      .slice(0, 10);  // Limit to 10 results
  }
  // Lucrare filtering logic
  private _filterLucrari(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.data.lucrari.filter((lucrare: any) => lucrare.numeLucrare.toLowerCase().includes(filterValue)).slice(0, 10);
  }

  // Method to handle Pacient selection
onPacientSelected(event: any): void {
  const selectedPacient = this.data.pacienti.find((pacient: any) => pacient.pacientId === event.option.value);
  if (selectedPacient) {
    this.addForm.get('pacient')?.setValue(selectedPacient.pacientId);  // Set the ID in the form
    this.addForm.get('pacientSearch')?.setValue(selectedPacient.name);  // Set the name in the input field
  }
}

// Method to handle Doctor selection
onDoctorSelected(event: any): void {
  const selectedDoctor = this.data.users.find((doctor: any) => doctor.userId === event.option.value);
  if (selectedDoctor) {
    this.addForm.get('doctor')?.setValue(selectedDoctor.userId);  // Set the ID in the form
    this.addForm.get('doctorSearch')?.setValue(`${selectedDoctor.firstName} ${selectedDoctor.lastName}`);  // Set the name in the input field
  }
}

// Method to handle Lucrare selection
onLucrareSelected(event: any): void {
  const selectedLucrare = this.data.lucrari.find((lucrare: any) => lucrare.lucrareId === event.option.value);
  if (selectedLucrare) {
    this.addForm.get('lucrare')?.setValue(selectedLucrare.lucrareId);  // Set the ID in the form
    this.addForm.get('lucrareSearch')?.setValue(selectedLucrare.numeLucrare);  // Set the name in the input field
  }
}

  onSave(): void {
    const newProgramare = {
      PacientPacientId: this.addForm.get('pacient')?.value,
      UserUserId: this.addForm.get('doctor')?.value,
      LucrareLucrareId: this.addForm.get('lucrare')?.value,
      OraProgramare: this.combineDateAndTime(),  // Combines date and time
      DescriereProgramare: '',  // Optional: You can add this field if needed
      ProgramareEfectuata: false // Default value for new programare
    };

    this.programariService.createProgramare(newProgramare).subscribe(() => {
      this.dialogRef.close(newProgramare);  // Close the dialog on success
    });
  }

  combineDateAndTime(): string {
    const date = this.addForm.get('date')?.value;
    const time = this.addForm.get('time')?.value;

    if (date && time) {
      const [hours, minutes] = time.split(':');
      date.setHours(+hours);
      date.setMinutes(+minutes);
      return date.toISOString();
    }
    return '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
