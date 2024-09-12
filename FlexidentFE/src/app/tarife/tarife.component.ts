import { Component, OnInit } from '@angular/core';
import { TarifeService } from '../tarife.service';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
export interface Lucrare {
  lucrareId: number;
  numeLucrare: string;
  pretLucrare: number;
  descriereLucrare: string;
}

@Component({
  selector: 'app-tarife',
  templateUrl: './tarife.component.html',
  styleUrls: ['./tarife.component.css'],
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, MatCardModule]
})
export class TarifeComponent implements OnInit {
  lucrari: Lucrare[] = [];

  constructor(private tarifeService: TarifeService) {}

  ngOnInit(): void {
    this.loadLucrari();
  }

  loadLucrari(): void {
    this.tarifeService.getLucrari().subscribe({
      next: (response: Lucrare[]) => {
        this.lucrari = response;
        console.log('Loaded lucrari:', this.lucrari);
      },
      error: (error) => {
        console.error('Error fetching lucrari', error);
      }
    });
  }
}
