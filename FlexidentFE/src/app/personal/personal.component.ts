import { Component, OnInit } from '@angular/core';
import { PaginatedUsersResponse, PersonalService, User } from '../personal.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatTableModule,
    CommonModule
  ],
})
export class PersonalComponent implements OnInit {
  displayedColumns: string[] = ['nume', 'email', 'phone'];
  doctors: any[] = [];
  asistenti: any[] = [];
  admini: any[] = [];

  constructor(private personalService: PersonalService) {}

  ngOnInit(): void {
    const pageNumber = 1; 
    const pageSize = 10;  
  
    this.personalService.getUsers(pageNumber, pageSize).subscribe((response: PaginatedUsersResponse) => {
      const users = response.users; 
      this.doctors = users.filter((user: User) => user.userRole === 1);
      this.asistenti = users.filter((user: User) => user.userRole === 2);
      this.admini = users.filter((user: User) => user.userRole === 3);
    });
  }
  
  
}
