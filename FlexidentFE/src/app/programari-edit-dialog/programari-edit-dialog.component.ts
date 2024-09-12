import { User  } from '../personal.service'
import { ProgramariService } from '../programari.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Lucrare } from '../tarife/tarife.component';
import { Pacient } from '../pacient.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, Observable } from 'rxjs';  // Ensure these are imported
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { map, startWith } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


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
  selector: 'app-programari-edit-dialog',
  templateUrl: './programari-edit-dialog.component.html',
  styleUrls: ['./programari-edit-dialog.component.css'],
  standalone: true,
  imports:[ MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
   MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatOptionModule,
  MatSelectModule,
  MatNativeDateModule,
  MatDatepickerModule,
  CommonModule,
  MatAutocompleteModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}
  ],
})


export class ProgramariEditDialogComponent implements OnInit {
  editForm: FormGroup;
  filteredPacients: Observable<any[]> = of([]);
  filteredUsers: Observable<any[]> = of([]);
  filteredLucrari: Observable<any[]> = of([]);
  

  constructor(
    private fb: FormBuilder,
    private programariService: ProgramariService,
    private dateAdapter: DateAdapter<Date>,

    public dialogRef: MatDialogRef<ProgramariEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dateAdapter.setLocale('en-GB');

    // Initialize the form with pacient, doctor, lucrare, and set the search fields to display names
    this.editForm = this.fb.group({
      pacient: [data.programare.pacient.pacientId],
      pacientSearch: [data.programare.pacient.name], // Set pacient name for display
      doctor: [data.programare.user.userId],
      doctorSearch: [`${data.programare.user.firstName} ${data.programare.user.lastName}`], // Set doctor name for display
      lucrare: [data.programare.lucrare.lucrareId],
      lucrareSearch: [data.programare.lucrare.numeLucrare], // Set lucrare name for display
      date: [new Date(data.programare.oraProgramare)],
      time: [this.getTimeString(data.programare.oraProgramare)]
    });
  }
  private getTimeString(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toTimeString().slice(0, 5); // Extract time in HH:MM format
  }
  ngOnInit(): void {
    // Pacient filtering logic
    this.filteredPacients = this.editForm.get('pacientSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPacients(value || ''))  // Filter based on the current input value
    );
    
    // Doctor filtering logic
    this.filteredUsers = this.editForm.get('doctorSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || ''))  // Filter based on the current input value
    );
  
    // Lucrare filtering logic
    this.filteredLucrari = this.editForm.get('lucrareSearch')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLucrari(value || ''))  // Filter based on the current input value
    );
  }

// Pacient selection handler
onPacientSelected(event: any): void {
  const selectedPacient = this.data.pacienti.find((pacient: Pacient) => pacient.pacientId === event.option.value);
  if (selectedPacient) {
    // Set the selected ID in the hidden field
    this.editForm.get('pacient')?.setValue(selectedPacient.pacientId);  // Set ID
    // Set the name for display and allow further typing
    this.editForm.get('pacientSearch')?.setValue(selectedPacient.name, { emitEvent: true }); // Ensure filtering resumes
  }
}


// Doctor selection handler
onDoctorSelected(event: any): void {
  const selectedDoctor = this.data.users.find((user: User) => user.userId === event.option.value);
  if (selectedDoctor) {
    this.editForm.get('doctor')?.setValue(selectedDoctor.userId);  // Set ID
    // Maintain the name in the input field so it shows and filtering continues
    this.editForm.get('doctorSearch')?.setValue(`${selectedDoctor.firstName} ${selectedDoctor.lastName}`, { emitEvent: false });
  }
}

// Lucrare selection handler
onLucrareSelected(event: any): void {
  const selectedLucrare = this.data.lucrari.find((lucrare: Lucrare) => lucrare.lucrareId === event.option.value);
  if (selectedLucrare) {
    this.editForm.get('lucrare')?.setValue(selectedLucrare.lucrareId);  // Set ID
    // Maintain the name in the input field so it shows and filtering continues
    this.editForm.get('lucrareSearch')?.setValue(selectedLucrare.numeLucrare, { emitEvent: false });
  }
}


// Filter Pacients
private _filterPacients(value: string): Pacient[] {
  const filterValue = value.toLowerCase();
  return this.data.pacienti
    .filter((pacient: Pacient) => pacient.name.toLowerCase().includes(filterValue))
    .slice(0, 10); // Limit the results to 10
}

// Filter Doctors
private _filterUsers(value: string): User[] {
  const filterValue = value.toLowerCase();
  return this.data.users
    .filter((user: User) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterValue))
    .slice(0, 10); // Limit the results to 10
}

// Filter Lucrari
private _filterLucrari(value: string): Lucrare[] {
  const filterValue = value.toLowerCase();
  return this.data.lucrari
    .filter((lucrare: Lucrare) => lucrare.numeLucrare.toLowerCase().includes(filterValue))
    .slice(0, 10); // Limit the results to 10
}


  onSave(): void {
    const dateControl = this.editForm.get('date');
    const timeControl = this.editForm.get('time');
    
    if (!dateControl || !timeControl) {
      console.error('Date or time control is invalid');
      return;
    }
    
    let date = dateControl.value;
    const time = timeControl.value;
    
    if (!(date instanceof Date)) {
      date = new Date(date); // Ensure it's a Date object
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    
    const combinedDateTime = date.toISOString(); // Convert to UTC format
    
    const updatedProgramare = {
      PacientPacientId: this.editForm.get('pacient')?.value,
      UserUserId: this.editForm.get('doctor')?.value,
      LucrareLucrareId: this.editForm.get('lucrare')?.value,
      OraProgramare: combinedDateTime,
      DescriereProgramare: this.data.programare.descriereProgramare,
      ProgramareEfectuata: this.data.programare.programareEfectuata
    };
    
    this.programariService.updateProgramare(this.data.programare.programareId, updatedProgramare)
      .subscribe(() => {
        this.dialogRef.close(updatedProgramare);
      }, error => {
        console.error('Failed to update the programare:', error);
      });
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
