import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacientDialogComponent } from '../pacient-dialog/pacient-dialog.component';
import { PacientService, Pacient, PaginatedResponse } from '../pacient.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { Programare } from '../programari.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ProgramariService } from '../programari.service';
import { TarifeService } from '../tarife.service';
import { PersonalService } from '../personal.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { EditPacientDialogComponent } from '../edit-pacient-dialog/edit-pacient-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeletePacientDialogComponent } from '../delete-pacient-dialog/delete-pacient-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pacienti',
  templateUrl: './pacienti.component.html',
  styleUrls: ['./pacienti.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class PacientiComponent implements OnInit {
  pacients: Pacient[] = [];
  totalPatients = 0;
  pageSize = 10;
  currentPage = 1;
  dataSource = new MatTableDataSource<Pacient>(); // Change to MatTableDataSource


  // Define the columns to be displayed in the table
  displayedColumns: string[] = ['name', 'phone', 'email', 'age', 'actions'];

  constructor(private dialog: MatDialog,
     private pacientService: PacientService, 
     private programariService: ProgramariService,
     private tarifeService: TarifeService,
     private personalService: PersonalService,// Use PersonalService for doctor details
     private cdr: ChangeDetectorRef, // Add ChangeDetectorRef

    ) {}

  ngOnInit(): void {
    this.loadPacients();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PacientDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Patient added successfully');
        this.loadPacients();  // Reload the list after adding a new patient
      }
    });
  }

  openDeleteDialog(pacient: Pacient): void {
    const dialogRef = this.dialog.open(DeletePacientDialogComponent, {
      width: '400px',
      data: { name: pacient.name }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the user confirmed, proceed with deletion
        this.deletePacient(pacient.pacientId!); // Call the delete method
      }
    });
  }
  
  
  loadPacients(): void {
    this.pacientService.getPacienti(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Pacient>) => {
        this.pacients = response.data;
        this.totalPatients = response.totalCount;
  
        // Update the MatTableDataSource with the latest data
        this.dataSource.data = this.pacients; // This updates the table's dataSource
      },
      error: (error) => {
        console.error('Error fetching pacients', error);
      }
    });
  }

  deletePacient(pacientId: number): void {
    this.pacientService.deletePacient(pacientId).subscribe(
      (response) => {
        console.log('Patient deleted successfully', response);
        this.loadPacients();  // Reload the list of patients after deletion
      },
      (error) => {
        console.error('Error deleting patient', error);
      }
    );
  }

  
// Add this function in the PacientiComponent
openEditDialog(pacient: Pacient): void {
  const dialogRef = this.dialog.open(EditPacientDialogComponent, {
    width: '235px',
    data: { 
      pacientId: pacient.pacientId,  // Add pacientId here
      name: pacient.name, 
      phone: pacient.phone, 
      email: pacient.email, 
      age: pacient.age 
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Send the PATCH request with the updated pacient data
      this.pacientService.updatePacient(result.pacientId, result).subscribe(
        (response) => {
          console.log('Patient updated successfully', response);
          this.loadPacients(); // Refresh the table after update
        },
        (error) => {
          console.error('Error updating patient', error);
        }
      );
    }
  });
}


 

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPacients();
  }

    // Method for generating and downloading PDF for the selected patient
  // Method for generating and downloading PDF for the selected patient
   // Method for generating and downloading PDF for the selected patient
   downloadFile(pacient: Pacient): void {
    if (!pacient.pacientId) {
      console.error('No valid pacientId found for this pacient.');
      return;
    }
  
    this.programariService.getProgramariByPacientId(pacient.pacientId).pipe(
      map((programari: Programare[]) => programari.filter(p => p.programareEfectuata)),
      switchMap((filteredProgramari: Programare[]) => {
        const observables = filteredProgramari.map((programare) => {
          return forkJoin({
            lucrare: of(programare.lucrare),
            doctor: of(programare.user),
            programare: of(programare)
          });
        });
        return forkJoin(observables);
      })
    ).subscribe((combinedData) => {
      const doc = new jsPDF();
  
      // Calculate the center of the page for the title
      const pageWidth = doc.internal.pageSize.getWidth();
      const titleText = `Istoricul medical al pacientului ${pacient.name}`;
      const textWidth = doc.getTextWidth(titleText);
      const xOffset = (pageWidth - textWidth) / 2;
  
      // Add the centered title to the PDF
      doc.text(titleText, xOffset, 10);
  
      // Define table headers
      const tableColumn = ["Pacient", "Varsta", "Lucrare", "Doctor", "Data efectuare"];
  
      // Map data to table rows
      const tableRows = combinedData.map(data => {
        return [
          pacient.name,
          pacient.age,
          data.lucrare.numeLucrare,
          `${data.doctor.firstName} ${data.doctor.lastName}`,
          new Date(data.programare.oraProgramare).toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        ];
      });
  
      // Add the table to the PDF
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
  
      // Save the PDF with a dynamic filename
      doc.save(`fisa_medicala_${pacient.name}.pdf`);
    }, error => {
      console.error('Error fetching programari for pacient:', error);
    });
  }
  
  
  }

