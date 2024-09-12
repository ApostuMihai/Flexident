import { Component, OnInit } from '@angular/core';
import { ProgramariService, Programare } from '../programari.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, formatDate } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgramariDeleteDialogComponent } from '../programari-delete-dialog/programari-delete-dialog.component';
import { ChangeDetectorRef } from '@angular/core';
import { ProgramariDialogComponent } from '../programari-dialog/programari-dialog.component';
import { ProgramariEditDialogComponent } from '../programari-edit-dialog/programari-edit-dialog.component';
import { PacientService } from '../pacient.service'; // Import PacientService
import { MatNativeDateModule } from '@angular/material/core';
import { AddProgramareDialogComponent } from '../add-programare-dialog/add-programare-dialog.component';  // Adjust path
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../personal.service';

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
  selector: 'app-programari',
  templateUrl: './programari.component.html',
  styleUrls: ['./programari.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class ProgramariComponent implements OnInit {
  displayedColumns: string[] = ['pacient', 'oraProgramare', 'doctor', 'lucrare', 'actiuni'];
  pacienti: any[] = [];
  users: any[] = [];
  lucrari: any[] = [];
  dataSource: Programare[] = [];
  totalRecords: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  selectedDate: Date = new Date();
  programari: Programare[] = []; 

  constructor(
    private dialog: MatDialog,
    private programariService: ProgramariService,
    private dateAdapter: DateAdapter<Date>,
    private cdr: ChangeDetectorRef,
    private pacientService: PacientService,  

  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.loadProgramari();
    this.loadPacienti();
    this.loadUsers();
    this.loadLucrari();
  }

  loadPacienti(): void {
    this.programariService.getPacienti().subscribe((response: any) => {
      console.log('Pacienti API Response:', response);  
      this.pacienti = response.data || [];  
    });
  }
  

  loadUsers(): void {
    this.programariService.getUsers().subscribe((response: any) => {
      console.log('Users API Response:', response);  
      this.users = response.users || [];  
    });
  }
  

  loadLucrari(): void {
    this.programariService.getLucrari().subscribe((data: any[]) => {
      this.lucrari = data;
    });
  }


 
  loadProgramari(): void {
    const dateStr = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
    
    this.programariService.getProgramari(this.pageNumber, this.pageSize, dateStr).subscribe((data) => {
      this.dataSource = data.programari;
      this.totalRecords = data.totalRecords;
      this.programari = data.programari;
  
      // Sort the programari array by date and time
      this.programari.sort((a: Programare, b: Programare) => {
        const dateA = new Date(a.oraProgramare).getTime();  // Convert to timestamp
        const dateB = new Date(b.oraProgramare).getTime();  // Convert to timestamp
  
        return dateA - dateB;  // Sort in ascending order (earlier first)
      });
  
      // Ensure the sorted data is also reflected in dataSource for the table
      this.dataSource = [...this.programari];
    });
  }
  

  onPageChange(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProgramari();
  }

  onDateChange(event: any): void {
    this.selectedDate = new Date(event.value);
    this.loadProgramari();
  }

  prevDay(): void {
    const previousDate = new Date(this.selectedDate);
    previousDate.setDate(this.selectedDate.getDate() - 1);
    this.selectedDate = previousDate;
    this.loadProgramari();
  }

  nextDay(): void {
    const nextDate = new Date(this.selectedDate);
    nextDate.setDate(this.selectedDate.getDate() + 1);
    this.selectedDate = nextDate;
    this.loadProgramari();
  }

  getDoctorName(programare: Programare): string {
    return `${programare.user.firstName} ${programare.user.lastName}`;
  }
  openAddProgramareDialog(): void {
    console.log('Pacienti data (before dialog):', this.pacienti);  
    const dialogRef = this.dialog.open(AddProgramareDialogComponent, {
      width: '300px',
      data: { pacienti: this.pacienti, users: this.users, lucrari: this.lucrari }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProgramari();
      }
    });
  }
  

  onEdit(element: Programare): void {
    this.pacientService.getPacienti(1, 100).subscribe((response: { data: any; }) => {
      const pacienti = response.data;
  
      this.programariService.getUsers().subscribe(usersResponse => {
        const users = usersResponse.users || []; 
  
        const filteredUsers = users.filter((user: User) => user.userRole === 1);
  
        this.programariService.getLucrari().subscribe(lucrari => {
          const dialogRef = this.dialog.open(ProgramariEditDialogComponent, {
            data: {
              programare: element,
              pacienti: pacienti,
              users: filteredUsers,
              lucrari: lucrari
            }
          });
  
          // Handle the dialog close event
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.loadProgramari();  
            }
          });
        });
      });
    });
  }
  
  

  onDone(element: Programare): void {
    const dialogRef = this.dialog.open(ProgramariDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.programariService.updateProgramareEfectuata(element.programareId, true).subscribe(() => {
          element.programareEfectuata = true; // Update the local data to reflect the change
          this.cdr.detectChanges(); // Trigger change detection manually if needed
        });
      }
    });
  }

  onDelete(element: Programare): void {
    const dialogRef = this.dialog.open(ProgramariDeleteDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.programariService.deleteProgramare(element.programareId).subscribe(() => {
          this.loadProgramari(); // Reload the data from the backend to ensure the UI is updated
          console.log('Programare deleted successfully');
        }, error => {
          console.error('Delete request failed', error);
        });
      }
    });
  }
  }
