import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  username: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.username = this.userService.getUsername();
  }
}
